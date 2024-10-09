const { uploadFile } = require("../middleware/image.middleware");
const {
  Ent_GroupPolicy,
  Tb_PhieuNCCCT,
  Ent_Nghiepvu,
  Ent_Nam,
  Ent_Thang,
  Ent_Connguoi,
  Ent_Nhompb,
  Ent_Phongbanda,
  Ent_Chinhanh,
  Tb_Tonkho,
  Ent_Taisan,
  Ent_Nhomts,
  Tb_TaisanQrCode,
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");
const formatDateTime = require("../utils/formatDatetime");

const createTb_PhieuNCCCT = async (phieunxct,data) => {
  const groupedItems = {};
    let ID_PhieuNXCT_Items = [];

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
  await Promise.all(Object.values(groupedItems).map(async (groupedItem) => {
    const newPhieuCCCCT =  await Tb_PhieuNCCCT.create({
      ID_PhieuNCC: data.ID_PhieuNCC,
      ID_Taisan: groupedItem.ID_Taisan,
      Dongia: groupedItem.Dongia,
      Namsx: groupedItem.Namsx,
      Soluong: groupedItem.Soluong,
      isDelete: 0
    });
    ID_PhieuNXCT_Items.push({
      ID_Taisan: groupedItem.ID_Taisan,
      ID_PhieuNCCCT: newPhieuCCCCT.ID_PhieuNCCCT
    });
  }));

  if(data.ID_Nghiepvu == 2) {
    await Promise.all(Object.values(groupedItems).map(async (groupedItem) => {
      // Kiểm tra xem có bản ghi tồn tại trong Tb_Tonkho không
      const tonkho = await Tb_Tonkho.findOne({
        where: {
          ID_Phongban: data.ID_Phongban,
          ID_Nam: data.ID_Nam,
          ID_Quy: data.ID_Quy,
          ID_Taisan: groupedItem.ID_Taisan
        }
      });
    
      if (tonkho) {
        // Nếu bản ghi đã tồn tại, cập nhật Nhapngoai và Tiennhapngoai
        await Tb_Tonkho.update({
          Nhapngoai: tonkho.Nhapngoai + groupedItem.Soluong,
          Tiennhapngoai: tonkho.Tiennhapngoai + groupedItem.Dongia * groupedItem.Soluong
        }, {
          where: {
            ID_Phongban: data.ID_Phongban,
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
            ID_Taisan: groupedItem.ID_Taisan
          }
        });
      } else {
        // Nếu không tìm thấy bản ghi, thêm mới vào Tb_Tonkho
        await Tb_Tonkho.create({
          ID_Taisan: groupedItem.ID_Taisan,
          ID_Nam: data.ID_Nam,
          ID_Quy: data.ID_Quy,
          ID_Thang: data.ID_Thang,
          ID_Phongban: data.ID_Phongban,
          Nhapngoai: groupedItem.Soluong,
          Tiennhapngoai: groupedItem.Dongia * groupedItem.Soluong
        });
      }
    }));    
  } else {
    console.log("test")
  }

  await Promise.all(Object.values(groupedItems).map(async (groupedItem) => {
    const taisan = await Ent_Taisan.findOne({
      where: {
        ID_Taisan: groupedItem.ID_Taisan,
        isDelete: 0
      },
      attributes: ['ID_Taisan', 'i_MaQrCode']
    });

    if(taisan.i_MaQrCode == 0 ){
      const [duan, taisanDetails] = await getDuanVsTaisanDetails(data.ID_Phongban, taisan.ID_Taisan);
      const foundItem = ID_PhieuNXCT_Items.find(item => item.ID_Taisan === taisan.ID_Taisan);
      
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
            ID_Taisan: foundItem.ID_Taisan,
            ID_PhieuNCCCT: foundItem.ID_PhieuNCCCT,
            ID_Phongban: data.ID_Phongban,
            Giatri: groupedItem.Dongia,
            Ngaykhoitao: data.NgayNX,
            MaQrCode: MaQrCode,
            Namsx: groupedItem.Namsx,
            Nambdsd: null,
            Ghichu : "",
            iTinhtrang : 0
          });
      };

      if (`${groupedItem.Soluong}` > "1") {
        for (let i = 1; i <= groupedItem.Soluong; i++) {
          await createQrCodeEntry(i);
        }
      } else {
        await createQrCodeEntry(1);
      }
      console.log(`Lưu vào bảng Tb_TaisanQrcode thành công cho ID_Taisan: ${foundItem.ID_Taisan}`);
    }
  }))


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

// const updateTb_PhieuNCCCT = async (phieunxct, ID_PhieuNCC) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const groupedItems = {};

//     // Group items by ID_Taisan
//     phieunxct.forEach(item => {
//       const { ID_Taisan, Dongia, Soluong, ID_PhieuNCCCT, Namsx, isDelete } = item;
//       if (!groupedItems[ID_Taisan]) {
//         groupedItems[ID_Taisan] = {
//           ID_Taisan,
//           items: []
//         };
//       }
//       groupedItems[ID_Taisan].items.push({ ID_PhieuNCCCT, Dongia, Soluong, Namsx, isDelete });
//     });

//     // Get all current items in Tb_PhieuNCCCT for the given ID_PhieuNCC
//     const currentItems = await Tb_PhieuNCCCT.findAll({
//       where: { ID_PhieuNCC },
//       transaction
//     });

//     // Determine which items need to be deleted
//     const currentItemIds = currentItems.map(item => item.ID_PhieuNCCCT);
//     const newItemIds = phieunxct.filter(item => item.ID_PhieuNCCCT).map(item => item.ID_PhieuNCCCT);
//     const itemsToDelete = currentItemIds.filter(id => !newItemIds.includes(id));

//     // Delete the items that are no longer in the updated list
//     if (itemsToDelete.length > 0) {
//       await Tb_PhieuNCCCT.destroy({
//         where: {
//           ID_PhieuNCCCT: itemsToDelete
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
//         const { ID_PhieuNCCCT, Dongia, Soluong, Namsx, isDelete } = item;

//         if (ID_PhieuNCCCT) {
//           // Prepare update for existing record
//           updatePromises.push(
//             Tb_PhieuNCCCT.update(
//               {
//                 ID_PhieuNCC,
//                 ID_Taisan,
//                 Dongia,
//                 Soluong,
//                 Namsx,
//                 isDelete
//               },
//               {
//                 where: { ID_PhieuNCCCT },
//                 transaction
//               }
//             )
//           );
//         } else {
//           // Prepare new record for bulk insert
//           createItems.push({
//             ID_PhieuNCC,
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
//       await Tb_PhieuNCCCT.bulkCreate(createItems, { transaction });
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
const updateTb_PhieuNCCCT = async (phieunxct, ID_PhieuNCC, data) => {
  const transaction = await sequelize.transaction();
  try {
    const groupedItems = {};

    // Nhóm và tổng hợp theo ID_Taisan
    phieunxct.forEach(item => {
      const { ID_Taisan, Dongia, Soluong, Namsx, isDelete } = item;
      if (!groupedItems[ID_Taisan]) {
        groupedItems[ID_Taisan] = {
          ID_Taisan,
          Namsx,
          Dongia: 0,
          Soluong: 0,
          isDelete
        };
      }
      groupedItems[ID_Taisan].Dongia = Number(Dongia);
      groupedItems[ID_Taisan].Soluong += Number(Soluong);
    });

    // Lấy các bản ghi hiện tại
    const currentItems = await Tb_PhieuNCCCT.findAll({
      where: { ID_PhieuNCC },
      transaction
    });

    // Xóa các bản ghi không còn trong danh sách update
    const currentItemIds = currentItems.map(item => item.ID_PhieuNCCCT);
    const newItemIds = phieunxct.filter(item => item.ID_PhieuNCCCT).map(item => item.ID_PhieuNCCCT);
    const itemsToDelete = currentItemIds.filter(id => !newItemIds.includes(id));

    if (itemsToDelete.length > 0) {
      await Tb_PhieuNCCCT.destroy({
        where: { ID_PhieuNCCCT: itemsToDelete },
        transaction
      });
    }

    // Cập nhật hoặc tạo mới các bản ghi
    await Promise.all(Object.values(groupedItems).map(async (groupedItem) => {
      const existingItem = currentItems.find(item => item.ID_Taisan === groupedItem.ID_Taisan);

      if (existingItem) {
        // Cập nhật bản ghi hiện tại
        await Tb_PhieuNCCCT.update({
          Dongia: groupedItem.Dongia,
          Namsx: groupedItem.Namsx,
          Soluong: groupedItem.Soluong,
          isDelete: 0
        }, {
          where: { ID_PhieuNCCCT: existingItem.ID_PhieuNCCCT },
          transaction
        });
      } else {
        // Tạo mới bản ghi trong bảng Tb_PhieuNCCCT
        const newPhieuCCCCT = await Tb_PhieuNCCCT.create({
          ID_PhieuNCC,
          ID_Taisan: groupedItem.ID_Taisan,
          Dongia: groupedItem.Dongia,
          Namsx: groupedItem.Namsx,
          Soluong: groupedItem.Soluong,
          isDelete: 0
        }, { transaction });

        // Nếu là tạo mới, thêm vào bảng tồn kho và tạo QR code
        if (data.ID_Nghiepvu == 2) {
          const tonkho = await Tb_Tonkho.findOne({
            where: {
              ID_Phongban: data.ID_Phongban,
              ID_Nam: data.ID_Nam,
              ID_Quy: data.ID_Quy,
              ID_Taisan: groupedItem.ID_Taisan
            },
            transaction
          });

          if (tonkho) {
            await Tb_Tonkho.update({
              Nhapngoai: tonkho.Nhapngoai + groupedItem.Soluong,
              Tiennhapngoai: tonkho.Tiennhapngoai + groupedItem.Dongia * groupedItem.Soluong
            }, {
              where: {
                ID_Phongban: data.ID_Phongban,
                ID_Nam: data.ID_Nam,
                ID_Quy: data.ID_Quy,
                ID_Taisan: groupedItem.ID_Taisan
              },
              transaction
            });
          } else {
            await Tb_Tonkho.create({
              ID_Taisan: groupedItem.ID_Taisan,
              ID_Nam: data.ID_Nam,
              ID_Quy: data.ID_Quy,
              ID_Thang: data.ID_Thang,
              ID_Phongban: data.ID_Phongban,
              Nhapngoai: groupedItem.Soluong,
              Tiennhapngoai: groupedItem.Dongia * groupedItem.Soluong
            }, { transaction });
          }

          // Xử lý QR code nếu tài sản chưa có mã QR
          const taisan = await Ent_Taisan.findOne({
            where: {
              ID_Taisan: groupedItem.ID_Taisan,
              isDelete: 0
            },
            attributes: ['ID_Taisan', 'i_MaQrCode'],
            transaction
          });

          if (taisan?.i_MaQrCode === 0) {
            await Tb_TaisanQrCode.destroy({
              where: {
                ID_Taisan: groupedItem.ID_Taisan,
                ID_PhieuNCCCT: newPhieuCCCCT.ID_PhieuNCCCT
              },
              transaction
            });

            const [duan, taisanDetails] = await getDuanVsTaisanDetails(data.ID_Phongban, taisan.ID_Taisan);

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
                ID_Taisan: groupedItem.ID_Taisan,
                ID_PhieuNCCCT: newPhieuCCCCT.ID_PhieuNCCCT,
                ID_Phongban: data.ID_Phongban,
                Giatri: groupedItem.Dongia,
                Ngaykhoitao: data.NgayNX,
                MaQrCode,
                Namsx: groupedItem.Namsx,
                Nambdsd: null,
                Ghichu: "",
                iTinhtrang: 0
              }, { transaction });
            };

            if (`${groupedItem.Soluong}` > "1") {
              for (let i = 1; i <= groupedItem.Soluong; i++) {
                await createQrCodeEntry(i);
              }
            } else {
              await createQrCodeEntry(1);
            }
          }
        }
      }
    }));

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


const getAllTb_PhieuNCCCT = async () => {
    // Điều kiện để lấy các bản ghi không bị XCTóa
    let whereClause = {
      isDelete: 0,
    };
  
    // Thực hiện truy vấn với Sequelize
    const res = await Tb_PhieuNCCCT.findAll({
      attributes: [
        "ID_PhieuNCCCT",
        "ID_PhieuNCC",
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

const scanTb_PhieuNCCCT = async (data) => {
  const file = await uploadFile(data.images);
  const res = await Tb_PhieuNCCCT.create(
    {
      Anhts: file ? file.id : "",
      ID_TaisanQrCode: data.ID_TaisanQrCode,
      ID_PhieuNCC: data.ID_PhieuNCC,
      ID_Taisan: data.ID_Taisan,
      Dongia: data.Dongia,
      Soluong: data.Soluong || 1,
      Namsx: data.Namsx,
    },
  );
  return res;

}
  
module.exports = {
  createTb_PhieuNCCCT,
  getAllTb_PhieuNCCCT,
  updateTb_PhieuNCCCT,
  scanTb_PhieuNCCCT
};
