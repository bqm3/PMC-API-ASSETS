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
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");

const createTb_PhieuNXCT = async (phieunxct,data) => {
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
  await Promise.all(Object.values(groupedItems).map(async (groupedItem) => {
    await Tb_PhieuNXCT.create({
      ID_PhieuNX: data.ID_PhieuNX,
      ID_Taisan: groupedItem.ID_Taisan,
      Dongia: groupedItem.Dongia,
      Namsx: groupedItem.Namsx,
      Soluong: groupedItem.Soluong,
      isDelete: 0
    });
  }));
};

const updateTb_PhieuNXCT = async (phieunxct, ID_PhieuNX) => {
  const transaction = await sequelize.transaction();
  try {
    const groupedItems = {};

    // Group items by ID_Taisan
    phieunxct.forEach(item => {
      const { ID_Taisan, Dongia, Soluong, ID_PhieuNXCT, Namsx, isDelete } = item;
      if (!groupedItems[ID_Taisan]) {
        groupedItems[ID_Taisan] = {
          ID_Taisan,
          items: []
        };
      }
      groupedItems[ID_Taisan].items.push({ ID_PhieuNXCT, Dongia, Soluong, Namsx, isDelete });
    });

    // Get all current items in Tb_PhieuNXCT for the given ID_PhieuNX
    const currentItems = await Tb_PhieuNXCT.findAll({
      where: { ID_PhieuNX },
      transaction
    });

    // Determine which items need to be deleted
    const currentItemIds = currentItems.map(item => item.ID_PhieuNXCT);
    const newItemIds = phieunxct.filter(item => item.ID_PhieuNXCT).map(item => item.ID_PhieuNXCT);
    const itemsToDelete = currentItemIds.filter(id => !newItemIds.includes(id));

    // Delete the items that are no longer in the updated list
    if (itemsToDelete.length > 0) {
      await Tb_PhieuNXCT.destroy({
        where: {
          ID_PhieuNXCT: itemsToDelete
        },
        transaction
      });
    }

    // Arrays for bulk operations
    const updatePromises = [];
    const createItems = [];

    // Process grouped items
    Object.values(groupedItems).forEach(group => {
      const { ID_Taisan, items } = group;

      items.forEach(item => {
        const { ID_PhieuNXCT, Dongia, Soluong, Namsx, isDelete } = item;

        if (ID_PhieuNXCT) {
          // Prepare update for existing record
          updatePromises.push(
            Tb_PhieuNXCT.update(
              {
                ID_PhieuNX,
                ID_Taisan,
                Dongia,
                Soluong,
                Namsx,
                isDelete
              },
              {
                where: { ID_PhieuNXCT },
                transaction
              }
            )
          );
        } else {
          // Prepare new record for bulk insert
          createItems.push({
            ID_PhieuNX,
            ID_Taisan,
            Dongia,
            Soluong,
            Namsx,
            isDelete: 0
          });
        }
      });
    });

    // Execute bulk update
    await Promise.all(updatePromises);

    // Execute bulk create if there are items to insert
    if (createItems.length > 0) {
      await Tb_PhieuNXCT.bulkCreate(createItems, { transaction });
    }

    // Commit the transaction
    await transaction.commit();
    return true;
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    return false; // Return a failure indicator
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
      ID_TaisanQrCode: data.ID_TaisanQrCode,
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
