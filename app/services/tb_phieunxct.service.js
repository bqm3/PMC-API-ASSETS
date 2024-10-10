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

// const createTb_PhieuNXCT = async (phieunxct,data) => {
//   const groupedItems = {};

//   // Nhóm và tính tổng theo ID_Taisan
//   phieunxct.forEach(item => {
//     const { ID_Taisan, Dongia, Soluong, Namsx } = item;
//     if (!groupedItems[ID_Taisan]) {
//       groupedItems[ID_Taisan] = {
//         ID_Taisan,
//         Namsx,
//         Dongia: 0,
//         Soluong: 0
//       };
//     }
//     // Cộng dồn tổng Dongia và Soluong
//     groupedItems[ID_Taisan].Dongia = Number(Dongia);
//     groupedItems[ID_Taisan].Soluong += Number(Soluong);
//   });
//   await Promise.all(Object.values(groupedItems).map(async (groupedItem) => {
//     await Tb_PhieuNXCT.create({
//       ID_PhieuNX: data.ID_PhieuNX,
//       ID_Taisan: groupedItem.ID_Taisan,
//       Dongia: groupedItem.Dongia,
//       Namsx: groupedItem.Namsx,
//       Soluong: groupedItem.Soluong,
//       isDelete: 0
//     });
//   }));
// };

const createTb_PhieuNXCT = async (phieunxct, data) => {
  const groupedItems = {};

  // Nhóm và tính tổng theo ID_Taisan
  phieunxct.forEach(item => {
    const { ID_Taisan, Dongia, Soluong, Namsx } = item;
    if (!groupedItems[ID_Taisan]) {
      groupedItems[ID_Taisan] = {
        ID_Taisan,
        Namsx,
        Dongia: 0,
        Soluong: 0
      };
    }
    // Cộng dồn tổng Dongia và Soluong
    groupedItems[ID_Taisan].Dongia = Number(Dongia);
    groupedItems[ID_Taisan].Soluong += Number(Soluong);
  });

  let ID_PhieuNXCT_Items = [];

  // Tạo các bản ghi trong Tb_PhieuNXCT và lưu lại ID_PhieuNXCT
  const createdItems = await Promise.all(
    Object.values(groupedItems).map(async (groupedItem) => {
      const newPhieuNXCT = await Tb_PhieuNXCT.create({
        ID_PhieuNX: data.ID_PhieuNX,
        ID_Taisan: groupedItem.ID_Taisan,
        Dongia: groupedItem.Dongia,
        Namsx: groupedItem.Namsx,
        Soluong: groupedItem.Soluong,
        isDelete: 0
      });
      ID_PhieuNXCT_Items.push({
        ID_Taisan: groupedItem.ID_Taisan,
        ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT
      });
    })
  );

  // Duyệt qua danh sách phieunxct
  for (const item of Object.values(groupedItems)) {
    const { ID_Taisan, Namsx } = item;

    // Tìm tài sản từ bảng ent_taisan theo ID_Taisan
    const taisan = await Ent_Taisan.findOne({
      where: {
        ID_Taisan: ID_Taisan,
        isDelete: 0
      },
      attributes: ['ID_Taisan', 'i_MaQrCode']
    });

    if (taisan) {
       try {
          // Lưu vào bảng Tb_Tonkho
          await Tb_Tonkho.create({
            ID_Taisan: ID_Taisan,
            ID_Nam: data.ID_Nam,
            ID_Thang : data.ID_Thang,
            ID_Quy: data.ID_Quy,
            ID_Phongban: data.ID_NoiNhap,
            Tondau: item.Soluong,
            Tientondau: item.Dongia * item.Soluong,
          });
          console.log(`Lưu vào bảng Tb_Tonkho thành công cho ID_Taisan: ${ID_Taisan}`);
        } catch (error) {
          console.error(`Lỗi khi lưu vào Tb_Tonkho cho ID_Taisan: ${ID_Taisan}`, error);
        }
      if (taisan.i_MaQrCode == 0) {

        const matchedItem = ID_PhieuNXCT_Items.find(
          item => item.ID_Taisan === ID_Taisan
        );
        const ID_PhieuNXCT = matchedItem ? matchedItem.ID_PhieuNXCT : null;

        const [duan, taisanDetails] = await getDuanVsTaisanDetails(data.ID_NoiNhap, ID_Taisan);
        // Tạo QR code
        const Thuoc = duan?.Thuoc;
        const ManhomTs = taisanDetails.ent_nhomts.Manhom;
        const MaID = taisanDetails.ID_Taisan;
        const MaTaisan = taisanDetails.Mats;
        const Ngay = formatDateTime(data.NgayNX);

        const createQrCodeEntry = async (index) => {
          const MaQrCode = index >= 1 
            ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}` 
            : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;
          
            await Tb_TaisanQrCode.create({
              ID_Nam: data.ID_Nam,
              ID_Quy: data.ID_Quy,
              ID_Taisan: ID_Taisan,
              ID_PhieuNXCT: ID_PhieuNXCT,
              ID_Phongban: data.ID_NoiNhap,
              Giatri: item.Dongia,
              Ngaykhoitao: data.NgayNX,
              MaQrCode: MaQrCode,
              Namsx: Namsx,
              Nambdsd: null,
              Ghichu : "",
              iTinhtrang : 0
            });
        };

        if (`${item.Soluong}` > "1") {
          for (let i = 1; i <= item.Soluong; i++) {
            await createQrCodeEntry(i);
          }
        } else {
          await createQrCodeEntry(1);
        }

        console.log(`Lưu vào bảng Tb_TaisanQrcode thành công cho ID_Taisan: ${ID_Taisan}`);
      } 
    } else {
      console.log(`Không tìm thấy tài sản với ID_Taisan: ${ID_Taisan}`);
    }
  }
};

const getDuanVsTaisanDetails = async (ID_Phongban, ID_Taisan) => {
  const [duan, taisanDetails] = await Promise.all([
    Ent_Phongbanda.findOne({
      attributes: [
        "ID_Phongban", "ID_Chinhanh", "ID_Nhompb", "Mapb", 
        "Thuoc", "Tenphongban", "Diachi", "Ghichu", "isDelete"
      ],
      where: {
        isDelete: 0,
        ID_Phongban: ID_Phongban
      }
    }),
    Ent_Taisan.findOne({
      attributes: [
        "ID_Taisan", "ID_Nhomts", "ID_Donvi", "Mats", 
        "Tents", "Thongso", "Ghichu", "isDelete"
      ],
      include: [{
        model: Ent_Nhomts,
        as: "ent_nhomts",
        attributes: ["ID_Nhomts", "Manhom", "Tennhom", "isDelete"],
        where: { isDelete: 0 }
      }],
      where: {
        ID_Taisan: ID_Taisan,
        isDelete: 0
      }
    })
  ]);

  return [duan, taisanDetails];
}


// const updateTb_PhieuNXCT = async (phieunxct, ID_PhieuNX) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const groupedItems = {};

//     // Group items by ID_Taisan
//     phieunxct.forEach(item => {
//       const { ID_Taisan, Dongia, Soluong, ID_PhieuNXCT, Namsx, isDelete } = item;
//       if (!groupedItems[ID_Taisan]) {
//         groupedItems[ID_Taisan] = {
//           ID_Taisan,
//           items: []
//         };
//       }
//       groupedItems[ID_Taisan].items.push({ ID_PhieuNXCT, Dongia, Soluong, Namsx, isDelete });
//     });

//     // Get all current items in Tb_PhieuNXCT for the given ID_PhieuNX
//     const currentItems = await Tb_PhieuNXCT.findAll({
//       where: { ID_PhieuNX },
//       transaction
//     });

//     // Determine which items need to be deleted
//     const currentItemIds = currentItems.map(item => item.ID_PhieuNXCT);
//     const newItemIds = phieunxct.filter(item => item.ID_PhieuNXCT).map(item => item.ID_PhieuNXCT);
//     const itemsToDelete = currentItemIds.filter(id => !newItemIds.includes(id));

//     // Delete the items that are no longer in the updated list
//     if (itemsToDelete.length > 0) {
//       await Tb_PhieuNXCT.destroy({
//         where: {
//           ID_PhieuNXCT: itemsToDelete
//         },
//         transaction
//       });
//     }

//     // Arrays for bulk operations
//     const updatePromises = [];
//     const createItems = [];

//     // Process grouped items
//     Object.values(groupedItems).forEach(group => {
//       const { ID_Taisan, items } = group;

//       items.forEach(item => {
//         const { ID_PhieuNXCT, Dongia, Soluong, Namsx, isDelete } = item;

//         if (ID_PhieuNXCT) {
//           // Prepare update for existing record
//           updatePromises.push(
//             Tb_PhieuNXCT.update(
//               {
//                 ID_PhieuNX,
//                 ID_Taisan,
//                 Dongia,
//                 Soluong,
//                 Namsx,
//                 isDelete
//               },
//               {
//                 where: { ID_PhieuNXCT },
//                 transaction
//               }
//             )
//           );
//         } else {
//           // Prepare new record for bulk insert
//           createItems.push({
//             ID_PhieuNX,
//             ID_Taisan,
//             Dongia,
//             Soluong,
//             Namsx,
//             isDelete: 0
//           });
//         }
//       });
//     });

//     // Execute bulk update
//     await Promise.all(updatePromises);

//     // Execute bulk create if there are items to insert
//     if (createItems.length > 0) {
//       await Tb_PhieuNXCT.bulkCreate(createItems, { transaction });
//     }

//     // Commit the transaction
//     await transaction.commit();
//     return true;
//   } catch (error) {
//     // Rollback the transaction in case of an error
//     await transaction.rollback();
//     return false; // Return a failure indicator
//   }
// };

const updateTb_PhieuNXCT = async (phieunxct, ID_PhieuNX, reqData) => {
  const transaction = await sequelize.transaction();
  try {
    const groupedItems = {};
    let ID_PhieuNXCT_Items = [];

    // Group items by ID_Taisan
    phieunxct.forEach(item => {
      const { ID_Taisan, Dongia, Soluong, ID_PhieuNXCT, Namsx, isDelete } = item;
      if (!groupedItems[ID_Taisan]) {
        groupedItems[ID_Taisan] = { ID_Taisan, Namsx, items: [] };
      }
      groupedItems[ID_Taisan].items.push({ ID_PhieuNXCT, Dongia, Soluong, Namsx, isDelete });
    });

    // Fetch necessary data in parallel
    const [currentItems, phieunx] = await Promise.all([
      Tb_PhieuNXCT.findAll({ where: { ID_PhieuNX, isDelete: 0 }, transaction }),
      Tb_PhieuNX.findOne({
        where: { ID_PhieuNX, isDelete: 0 },
        attributes: ["ID_NoiNhap", "ID_Nam", "ID_Quy", "ID_Thang", "isDelete"],
      }),
    ]);

    const { ID_NoiNhap, ID_Nam, ID_Quy, ID_Thang } = phieunx?.dataValues || {};

    // Find items to delete
    const currentItemIds = currentItems.map(item => item.ID_PhieuNXCT);
    const newItemIds = phieunxct.filter(item => item.ID_PhieuNXCT).map(item => item.ID_PhieuNXCT);
    const itemsToDelete = currentItemIds.filter(id => !newItemIds.includes(id));

    // Delete removed items and related QR codes in bulk
    if (itemsToDelete.length > 0) {
      await Promise.all([
        Tb_PhieuNXCT.destroy({ where: { ID_PhieuNXCT: itemsToDelete }, transaction }),
        Tb_TaisanQrCode.destroy({ where: { ID_PhieuNXCT: itemsToDelete }, transaction }),
      ]);
    }

    const updatePromises = [];
    const createItems = [];

    // Helper function to update/create QR codes
    const handleQrCodes = async (taisan, matchedItem, Dongia, Soluong, reqData,isDelete) => {
      const [duan, taisanDetails] = await getDuanVsTaisanDetails(ID_NoiNhap, taisan.ID_Taisan);
      const Thuoc = duan?.Thuoc;
      const ManhomTs = taisanDetails.ent_nhomts.Manhom;
      const MaID = taisanDetails.ID_Taisan;
      const MaTaisan = taisanDetails.Mats;
      const Ngay = formatDateTime(reqData.NgayNX);

      const createQrCodeEntry = async (index) => {
        const MaQrCode = index > 1
          ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}`
          : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;
        
        await Tb_TaisanQrCode.create({
          ID_Nam, ID_Quy, ID_Taisan: taisan.ID_Taisan, ID_PhieuNXCT: matchedItem.ID_PhieuNXCT,
          ID_Phongban:ID_NoiNhap , Giatri: Dongia, Ngaykhoitao: reqData.NgayNX, MaQrCode, Namsx: matchedItem.Namsx,
          Ghichu: "",
          iTinhtrang: 0,
          isDelete: isDelete
        }, { transaction });
      };

      // Create QR codes based on quantity
      if (`${Soluong}` > "1") {
        for (let i = 1; i <= Soluong; i++) {
          await createQrCodeEntry(i);
        }
      } else {
        await createQrCodeEntry(1);
      }
    };

    // Process grouped items
    for (const group of Object.values(groupedItems)) {
      const { ID_Taisan, items } = group;

      for (const item of items) {
        const { ID_PhieuNXCT, Dongia, Soluong, isDelete } = item;

        if (ID_PhieuNXCT) {
          // Update existing record
          updatePromises.push(
            Tb_PhieuNXCT.update({ ID_PhieuNX, ID_Taisan, Dongia, Soluong, Namsx: item.Namsx, isDelete }, 
            { where: { ID_PhieuNXCT }, transaction })
          );

          ID_PhieuNXCT_Items.push({ ID_Taisan, ID_PhieuNXCT });

          // Update Tb_Tonkho
          await Tb_Tonkho.update(
            { Tondau: Soluong, Tientondau: Dongia * Soluong },
            { where: { ID_Taisan, ID_Nam, ID_Thang, ID_Quy, ID_Phongban:ID_NoiNhap }, transaction }
          );

          const taisan = await Ent_Taisan.findOne({
            where: { ID_Taisan, isDelete: 0 },
            attributes: ['ID_Taisan', 'i_MaQrCode'],
            transaction
          });

          // Handle QR codes
          if (taisan?.i_MaQrCode === 0) {
            await Tb_TaisanQrCode.destroy({
              where: {
                ID_Taisan,
                ID_PhieuNXCT
              },
              transaction
            });
            await handleQrCodes(taisan, { ID_PhieuNXCT, Namsx: item.Namsx }, Dongia, Soluong, reqData,2);
          }
        } else {
          // Create new record
          const newPhieuNXCT = await Tb_PhieuNXCT.create({ ID_PhieuNX, ID_Taisan, Dongia, Soluong, Namsx: item.Namsx, isDelete: 0 }, { transaction });
          ID_PhieuNXCT_Items.push({ ID_Taisan, ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT });

          // Insert into Tb_Tonkho
          await Tb_Tonkho.create({ ID_Taisan, ID_Nam, ID_Thang, ID_Quy, ID_Phongban: ID_NoiNhap, Tondau: Soluong, Tientondau: Dongia * Soluong }, { transaction });

          const taisan = await Ent_Taisan.findOne({ where: { ID_Taisan, isDelete: 0 }, attributes: ['ID_Taisan', 'i_MaQrCode'], transaction });

          // Handle QR codes for new record
          if (taisan?.i_MaQrCode === 0) {
            await handleQrCodes(taisan, { ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT, Namsx: item.Namsx }, Dongia, Soluong, reqData,0);
          }
        }
      }
    }

    // Execute bulk updates and commit
    await Promise.all(updatePromises);
    await transaction.commit();
    return true;

  } catch (error) {
    console.error('Error in updateTb_PhieuNXCT:', error);
    await transaction.rollback();
    return false;
  }
};

const getAllTb_PhieuNXCT = async () => {
    // Điều kiện để lấy các bản ghi không bị XCTóa
    let whereClause = {
      isDelete: 0,
    };
  
    // Thực hiện truy vấn với Sequelize
    const res = await Tb_PhieuNXCT.findAll({
      attributes: [
        "ID_PhieuNXCT",
        "ID_PhieuNX",
        "ID_Taisan",
        "Dongia",
        "Soluong",
        "Namsx",
        "isDelete"
      ],
      where: whereClause,
    });
  
    return res;
  };

const scanTb_PhieuNXCT = async (data) => {
  const file = await uploadFile(data.images);
  const res = await Tb_PhieuNXCT.create(
    {
      Anhts: file ? file.id : "",
      ID_TaisanQrcode: data.ID_TaisanQrcode,
      ID_PhieuNX: data.ID_PhieuNX,
      ID_Taisan: data.ID_Taisan,
      Dongia: data.Dongia,
      Soluong: data.Soluong || 1,
      Namsx: data.Namsx,
    },
  );
  return res;

}
  
module.exports = {
  createTb_PhieuNXCT,
  getAllTb_PhieuNXCT,
  updateTb_PhieuNXCT,
  scanTb_PhieuNXCT
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

