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

  await Promise.all(phieunxct.map(async (item) => {
    // Thực hiện insert dữ liệu từ mỗi item trong mảng phieunxct
    await Tb_PhieuNXCT.create({
      ID_PhieuNX: data.ID_PhieuNX,
      ID_Taisan: item.ID_Taisan,
      Dongia: item.Dongia,
      Soluong: item.Soluong,
      isDelete: 0
    });
  }));
};

const updateTb_PhieuNXCT = async(phieunxct,data) => {
  await Promise.all(phieunxct.map(async (item) => {
    // Thực hiện insert dữ liệu từ mỗi item trong mảng phieunxct
    await Tb_PhieuNXCT.update({
      ID_PhieuNX: data.ID_PhieuNX,
      ID_Taisan: item.ID_Taisan,
      Dongia: item.Dongia,
      Soluong: item.Soluong,
      isDelete: item.isDelete
    },
    {
      where: {
        ID_PhieuNXCT: item.ID_PhieuNXCT,
      },
    });
  }));
}

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
