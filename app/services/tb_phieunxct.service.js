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
    const { ID_Taisan, Dongia, Soluong } = item;
    if (!groupedItems[ID_Taisan]) {
      groupedItems[ID_Taisan] = {
        ID_Taisan,
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
      Soluong: groupedItem.Soluong,
      isDelete: 0
    });
  }));
};

const updateTb_PhieuNXCT = async (phieunxct, ID_PhieuNX) => {
  const groupedItems = {};

  // Group items by ID_Taisan
  phieunxct.forEach(item => {
    const { ID_Taisan, Dongia, Soluong, ID_PhieuNXCT, isDelete } = item;
    if (!groupedItems[ID_Taisan]) {
      groupedItems[ID_Taisan] = {
        ID_Taisan,
        items: []
      };
    }
    groupedItems[ID_Taisan].items.push({ ID_PhieuNXCT, Dongia, Soluong, isDelete });
  });

  // Process grouped items
  await Promise.all(Object.values(groupedItems).map(async (group) => {
    const { ID_Taisan, items } = group;


    // Iterate through items for the same ID_Taisan
    for (const item of items) {
      const { ID_PhieuNXCT, Dongia, Soluong, isDelete } = item;

      if (ID_PhieuNXCT) {
        // Update existing record
        await Tb_PhieuNXCT.update({
          ID_PhieuNX: ID_PhieuNX,
          ID_Taisan,
          Dongia,
          Soluong,
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
        "isDelete"
      ],
      where: whereClause,
    });
  
    return res;
  };
  

// const updateTb_PhieuNXCT = async (data) => {
//   let whereClause = {
//     isDelete: 0,
//     ID_Policy: data.ID_Policy,
//   };

//   const res = await Tb_PhieuNXCT.update(
//     {
//       Policy: data.Policy,
//       ID_GroupPolicy: data.ID_GroupPolicy,
//       GroupPolicy: data.GroupPolicy,
//     },
//     {
//       where: whereClause,
//     }
//   );
//   return res;
// };

// const deleteTb_PhieuNXCT = async (ID) => {
//   const res = await Tb_PhieuNXCT.update(
//     { isDelete: 1 },
//     {
//       where: {
//         ID_Policy: ID,
//       },
//     }
//   );
//   return res;
// };

module.exports = {
  createTb_PhieuNXCT,
  getAllTb_PhieuNXCT,
  updateTb_PhieuNXCT
};
