const { uploadFile } = require("../middleware/image.middleware");
const {
  Ent_GroupPolicy,
  Tb_PhieuNXCT,
  Ent_Nghiepvu,
  Ent_Nam,
  Ent_Thang,
  Ent_Connguoi,
  Ent_Nhompb,
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhomts,
  Ent_Taisan,
  Tb_Tonkho,
  Tb_TaisanQrCode,
  Tb_PhieuNX,
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");

const createTb_PhieuNXNBCT = async (phieunxct, data) => {
  const groupedItems = {};
  const ID_PhieuNXCTs = [];
  const transaction = await sequelize.transaction();

  try {
    await Promise.all(
      phieunxct.map(async (item) => {
        const { ID_Taisan, ID_TaisanQrcode, Soluong } = item;
        if (!groupedItems[ID_Taisan]) {
          groupedItems[ID_Taisan] = { ID_Taisan, ID_TaisanQrcode, Soluong };
        } else {
          groupedItems[ID_Taisan].Soluong += Soluong;
        }

        if (item.ID_TaisanQrcode !== null) {
          const checkNXCT = await Tb_PhieuNXCT.findOne({
            where: {
              ID_TaisanQrcode: item.ID_TaisanQrcode,
              isDelete: 0,
            },
            transaction, // Đảm bảo transaction được truyền vào đây
          });
          // console.log("checkNXCT", checkNXCT);

          const checkUserTaisan = await Tb_TaisanQrCode.findByPk(
            item.ID_TaisanQrcode,
            {
              attributes: ["ID_TaisanQrcode", "ID_User"],
            },
            transaction
          );

          if (checkUserTaisan.ID_User != null && checkUserTaisan.ID_User != 0) {
            throw new Error(
              `Tài sản này đã giao cho user có ID là : ${checkUserTaisan.ID_User}`
            );
          }

          await Tb_TaisanQrCode.update(
            {
              iTinhtrang: 1,
              isDelete: 1,
            },
            {
              where: {
                ID_TaisanQrcode: item.ID_TaisanQrcode,
                isDelete: 0,
              },
              transaction,
            }
          );

          if (checkNXCT) {
            throw new Error(`Đã có: ${item.ID_Taisan}`);
          } else {
            const creatNXCT = await Tb_PhieuNXCT.create(
              {
                ID_Taisan: item.ID_Taisan,
                ID_TaisanQrcode: item.ID_TaisanQrcode,
                Soluong: item.Soluong,
                ID_PhieuNX: data.ID_PhieuNX,
                Dongia: item.Dongia || 0,
                Namsx: item.Namsx || null,
                isDelete: 0,
              },
              { transaction } // Đảm bảo transaction được truyền vào đây
            );
            // ?
            ID_PhieuNXCTs.push({
              ID_Taisan: item.ID_Taisan,
              ID_PhieuNXCT: creatNXCT.ID_PhieuNXCT,
            });
          }
        } else {
          await Tb_PhieuNXCT.create(
            {
              ID_Taisan: item.ID_Taisan,
              ID_TaisanQrcode: null,
              Soluong: item.Soluong,
              ID_PhieuNX: data.ID_PhieuNX,
              Dongia: item.Dongia || 0,
              Namsx: item.Namsx || null,
              isDelete: 0,
            },
            { transaction } // Đảm bảo transaction được truyền vào đây
          );
        }
      })
    );

    for (const item of Object.values(groupedItems)) {
      const [updatedRowCount] = await Tb_Tonkho.update(
        {
          XuatNB: Sequelize.literal(`XuatNB + ${item.Soluong}`),
          TonSosach: Sequelize.literal(
            `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
          ),
        },
        {
          where: {
            ID_Taisan: item.ID_Taisan,
            ID_Phongban: data.ID_NoiXuat,
            TonSosach: { [Op.gte]: item.Soluong },
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
            isDelete: 0,
          },
          transaction,
        }
      );

      if (updatedRowCount === 0) {
        throw new Error(
          `Số lượng không hợp lệ cho ID_Taisan: ${item.ID_Taisan}`
        );
      }

      // Kiểm tra và cập nhật kho nhận
      const [checkUpdated] = await Tb_Tonkho.update(
        {
          NhapNB: Sequelize.literal(`NhapNB + ${item.Soluong}`),
          TonSosach: Sequelize.literal(
            `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
          ),
        },
        {
          where: {
            ID_Taisan: item.ID_Taisan,
            ID_Phongban: data.ID_NoiNhap,
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
          },
          transaction,
        }
      );

      // Nếu không tồn tại bản ghi thì tạo mới
      if (checkUpdated === 0) {
        await Tb_Tonkho.create(
          {
            ID_Taisan: item.ID_Taisan,
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
            ID_Thang: data.ID_Thang,
            ID_Phongban: data.ID_NoiNhap,
            NhapNB: item.Soluong,
            TonSosach: Sequelize.literal(
              `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
            ),
          },
          { transaction }
        );
      }

      const [duan, taisanDetails] = await getDuanVsTaisanDetails(
        data.ID_NoiNhap,
        item.ID_Taisan
      );
      const matchedItem = ID_PhieuNXCTs.find(
        (it) => it.ID_Taisan === item.ID_Taisan
      );
      const ID_PhieuNXCT = matchedItem ? matchedItem.ID_PhieuNXCT : null;

      const Thuoc = duan?.Thuoc;
      const ManhomTs = taisanDetails.ent_nhomts.Manhom;
      const MaID = taisanDetails.ID_Taisan;
      const MaTaisan = taisanDetails.Mats;
      const Ngay = formatDateTime(data.NgayNX);

      const createQrCodeEntry = async (index) => {
        const MaQrCode =
          index >= 1
            ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}`
            : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;

        await Tb_TaisanQrCode.create(
          {
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
            ID_Taisan: item.ID_Taisan,
            ID_PhieuNXCT: ID_PhieuNXCT,
            ID_Phongban: data.ID_NoiNhap,
            Giatri: null,
            Ngaykhoitao: data.NgayNX,
            MaQrCode,
            Namsx: null,
            Nambdsd: null,
            Ghichu: "",
            iTinhtrang: 0,
          },
          { transaction }
        );
      };

      if (item.Soluong > 1) {
        for (let i = 1; i <= item.Soluong; i++) {
          await createQrCodeEntry(i);
        }
      } else {
        await createQrCodeEntry(1);
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getDuanVsTaisanDetails = async (ID_Phongban, ID_Taisan) => {
  const [duan, taisanDetails] = await Promise.all([
    Ent_Phongbanda.findOne({
      attributes: [
        "ID_Phongban",
        "ID_Chinhanh",
        "ID_Nhompb",
        "Mapb",
        "Thuoc",
        "Tenphongban",
        "Diachi",
        "Ghichu",
        "isDelete",
      ],
      where: {
        isDelete: 0,
        ID_Phongban: ID_Phongban,
      },
    }),
    Ent_Taisan.findOne({
      attributes: [
        "ID_Taisan",
        "ID_Nhomts",
        "ID_Donvi",
        "Mats",
        "Tents",
        "Thongso",
        "Ghichu",
        "isDelete",
      ],
      include: [
        {
          model: Ent_Nhomts,
          as: "ent_nhomts",
          attributes: ["ID_Nhomts", "Manhom", "Tennhom", "isDelete"],
          where: { isDelete: 0 },
        },
      ],
      where: {
        ID_Taisan: ID_Taisan,
        isDelete: 0,
      },
    }),
  ]);

  return [duan, taisanDetails];
};

// const updateTb_PhieuNXCT = async (phieunxct, ID_PhieuNX, reqData) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const groupedItems = {};
//     let ID_PhieuNXCT_Items = [];

//     // Group items by ID_Taisan
//     phieunxct.forEach((item) => {
//       const { ID_Taisan, Dongia, Soluong, ID_PhieuNXCT, Namsx, isDelete } =
//         item;
//       if (!groupedItems[ID_Taisan]) {
//         groupedItems[ID_Taisan] = { ID_Taisan, Namsx, items: [] };
//       }
//       groupedItems[ID_Taisan].items.push({
//         ID_PhieuNXCT,
//         Dongia,
//         Soluong,
//         Namsx,
//         isDelete,
//       });
//     });

//     // Fetch necessary data in parallel
//     const [currentItems, phieunx] = await Promise.all([
//       Tb_PhieuNXCT.findAll({ where: { ID_PhieuNX }, transaction }),
//       Tb_PhieuNX.findOne({
//         where: { ID_PhieuNX },
//         attributes: ["ID_Phongban", "ID_Nam", "ID_Quy", "ID_Thang"],
//       }),
//     ]);

//     const { ID_Phongban, ID_Nam, ID_Quy, ID_Thang } = phieunx?.dataValues || {};

//     // Find items to delete
//     const currentItemIds = currentItems.map((item) => item.ID_PhieuNXCT);
//     const newItemIds = phieunxct
//       .filter((item) => item.ID_PhieuNXCT)
//       .map((item) => item.ID_PhieuNXCT);
//     const itemsToDelete = currentItemIds.filter(
//       (id) => !newItemIds.includes(id)
//     );

//     // Delete removed items and related QR codes in bulk
//     if (itemsToDelete.length > 0) {
//       await Promise.all([
//         Tb_PhieuNXCT.destroy({
//           where: { ID_PhieuNXCT: itemsToDelete },
//           transaction,
//         }),
//         Tb_TaisanQrCode.destroy({
//           where: { ID_PhieuNXCT: itemsToDelete },
//           transaction,
//         }),
//       ]);
//     }

//     const updatePromises = [];
//     const createItems = [];

//     // Helper function to update/create QR codes
//     const handleQrCodes = async (
//       taisan,
//       matchedItem,
//       Dongia,
//       Soluong,
//       reqData,
//       isDelete
//     ) => {
//       const [duan, taisanDetails] = await getDuanVsTaisanDetails(
//         ID_Phongban,
//         taisan.ID_Taisan
//       );
//       const Thuoc = duan?.Thuoc;
//       const ManhomTs = taisanDetails.ent_nhomts.Manhom;
//       const MaID = taisanDetails.ID_Taisan;
//       const MaTaisan = taisanDetails.Mats;
//       const Ngay = formatDateTime(reqData.NgayNX);

//       const createQrCodeEntry = async (index) => {
//         const MaQrCode =
//           index > 1
//             ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}`
//             : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;

//         await Tb_TaisanQrCode.create(
//           {
//             ID_Nam,
//             ID_Quy,
//             ID_Taisan: taisan.ID_Taisan,
//             ID_PhieuNXCT: matchedItem.ID_PhieuNXCT,
//             ID_Phongban,
//             Giatri: Dongia,
//             Ngaykhoitao: reqData.NgayNX,
//             MaQrCode,
//             Namsx: matchedItem.Namsx,
//             Ghichu: "",
//             iTinhtrang: 0,
//             isDelete: isDelete,
//           },
//           { transaction }
//         );
//       };

//       // Create QR codes based on quantity
//       if (`${Soluong}` > "1") {
//         for (let i = 1; i <= Soluong; i++) {
//           await createQrCodeEntry(i);
//         }
//       } else {
//         await createQrCodeEntry(1);
//       }
//     };

//     // Process grouped items
//     for (const group of Object.values(groupedItems)) {
//       const { ID_Taisan, items } = group;

//       for (const item of items) {
//         const { ID_PhieuNXCT, Dongia, Soluong, isDelete } = item;

//         if (ID_PhieuNXCT) {
//           // Update existing record
//           updatePromises.push(
//             Tb_PhieuNXCT.update(
//               {
//                 ID_PhieuNX,
//                 ID_Taisan,
//                 Dongia,
//                 Soluong,
//                 Namsx: item.Namsx,
//                 isDelete,
//               },
//               { where: { ID_PhieuNXCT }, transaction }
//             )
//           );

//           ID_PhieuNXCT_Items.push({ ID_Taisan, ID_PhieuNXCT });

//           // Update Tb_Tonkho
//           await Tb_Tonkho.update(
//             { Tondau: Soluong, Tientondau: Dongia * Soluong },
//             {
//               where: { ID_Taisan, ID_Nam, ID_Thang, ID_Quy, ID_Phongban },
//               transaction,
//             }
//           );

//           const taisan = await Ent_Taisan.findOne({
//             where: { ID_Taisan, isDelete: 0 },
//             attributes: ["ID_Taisan", "i_MaQrCode"],
//             transaction,
//           });

//           // Handle QR codes
//           if (taisan?.i_MaQrCode === 0) {
//             await Tb_TaisanQrCode.destroy({
//               where: {
//                 ID_Taisan,
//                 ID_PhieuNXCT,
//               },
//               transaction,
//             });
//             await handleQrCodes(
//               taisan,
//               { ID_PhieuNXCT, Namsx: item.Namsx },
//               Dongia,
//               Soluong,
//               reqData,
//               2
//             );
//           }
//         } else {
//           // Create new record
//           const newPhieuNXCT = await Tb_PhieuNXCT.create(
//             {
//               ID_PhieuNX,
//               ID_Taisan,
//               Dongia,
//               Soluong,
//               Namsx: item.Namsx,
//               isDelete: 0,
//             },
//             { transaction }
//           );
//           ID_PhieuNXCT_Items.push({
//             ID_Taisan,
//             ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT,
//           });

//           // Insert into Tb_Tonkho
//           await Tb_Tonkho.create(
//             {
//               ID_Taisan,
//               ID_Nam,
//               ID_Thang,
//               ID_Quy,
//               ID_Phongban,
//               Tondau: Soluong,
//               Tientondau: Dongia * Soluong,
//             },
//             { transaction }
//           );

//           const taisan = await Ent_Taisan.findOne({
//             where: { ID_Taisan, isDelete: 0 },
//             attributes: ["ID_Taisan", "i_MaQrCode"],
//             transaction,
//           });

//           // Handle QR codes for new record
//           if (taisan?.i_MaQrCode === 0) {
//             await handleQrCodes(
//               taisan,
//               { ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT, Namsx: item.Namsx },
//               Dongia,
//               Soluong,
//               reqData,
//               0
//             );
//           }
//         }
//       }
//     }

//     // Execute bulk updates and commit
//     await Promise.all(updatePromises);
//     await transaction.commit();
//     return true;
//   } catch (error) {
//     console.error("Error in updateTb_PhieuNXCT:", error);
//     await transaction.rollback();
//     return false;
//   }
// };

// const getAllTb_PhieuNXCT = async () => {
//   // Điều kiện để lấy các bản ghi không bị XCTóa
//   let whereClause = {
//     isDelete: 0,
//   };

//   // Thực hiện truy vấn với Sequelize
//   const res = await Tb_PhieuNXCT.findAll({
//     attributes: [
//       "ID_PhieuNXCT",
//       "ID_PhieuNX",
//       "ID_Taisan",
//       "Dongia",
//       "Soluong",
//       "Namsx",
//       "isDelete",
//     ],
//     where: whereClause,
//   });

//   return res;
// };

// const scanTb_PhieuNXCT = async (data) => {
//   const file = await uploadFile(data.images);
//   const res = await Tb_PhieuNXCT.create({
//     Anhts: file ? file.id : "",
//     ID_TaisanQrcode: data.ID_TaisanQrcode,
//     ID_PhieuNX: data.ID_PhieuNX,
//     ID_Taisan: data.ID_Taisan,
//     Dongia: data.Dongia,
//     Soluong: data.Soluong || 1,
//     Namsx: data.Namsx,
//   });
//   return res;
// };

module.exports = {
  createTb_PhieuNXNBCT,
};

function formatDateTime(data) {
  const date = new Date(data); // Chuyển chuỗi thành đối tượng Date

  if (isNaN(date)) {
    throw new Error("Invalid date value");
  }

  const year = date.getFullYear().toString().slice(2); // Lấy 2 số cuối của năm
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng 2 chữ số
  const day = date.getDate().toString().padStart(2, "0"); // Ngày 2 chữ số

  return `${year}${month}${day}`;
}
