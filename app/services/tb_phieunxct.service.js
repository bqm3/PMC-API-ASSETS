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
const { Op } = require("sequelize");

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
  const groupedItems = {};

  // Group items by ID_Taisan
  phieunxct.forEach(item => {
    const { ID_Taisan, Dongia, Soluong, ID_PhieuNXCT,Namsx, isDelete } = item;
    if (!groupedItems[ID_Taisan]) {
      groupedItems[ID_Taisan] = {
        ID_Taisan,
        items: []
      };
    }
    groupedItems[ID_Taisan].items.push({ ID_PhieuNXCT, Dongia, Soluong,Namsx, isDelete });
  });

  // Process grouped items
  await Promise.all(Object.values(groupedItems).map(async (group) => {
    const { ID_Taisan, items } = group;


    // Iterate through items for the same ID_Taisan
    for (const item of items) {
      const { ID_PhieuNXCT, Dongia, Soluong,Namsx, isDelete } = item;

      if (ID_PhieuNXCT) {
        // Update existing record
        await Tb_PhieuNXCT.update({
          ID_PhieuNX: ID_PhieuNX,
          ID_Taisan,
          Dongia,
          Soluong,
          Namsx,
          isDelete: isDelete
        }, {
          where: { ID_PhieuNXCT }
        });
      } else {
        // Create new record
        await Tb_PhieuNXCT.create({
          ID_PhieuNX: ID_PhieuNX,
          ID_Taisan,
          Dongia,
          Soluong,
          Namsx,
          isDelete: 0
        });
      }
    }
  }));
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
