const {
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhompb,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_phongbanda = async (data) => {
  const res = await Ent_Phongbanda.create(data);
  return res;
};

const getAllEnt_phongbanda = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Phongbanda.findAll({
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
    include: [
      {
        model: Ent_Chinhanh,
        attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
        where: { isDelete: 0 },
      },
      {
        model: Ent_Nhompb,
        attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
        where: { isDelete: 0 },
      },
    ],
    where: whereClause,
  });
  return res;
};

const getDetailEnt_phongbanda = async (id) => {
  const res = await Ent_Phongbanda.findByPk(id, {
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
    include: [
      {
        model: Ent_Chinhanh,
        as: "ent_chinhanh",
        attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
        where: { isDelete: 0 },
      },
      {
        model: Ent_Nhompb,
        as: "ent_phongban",
        attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
        where: { isDelete: 0 },
      },
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};

const updateEnt_phongbanda = async (data) => {
  console.log(data);
  let whereClause = {
    isDelete: 0,
    ID_Phongban: Number(data.ID_Phongban),
  };

  const res = await Ent_Phongbanda.update(
    {
      ID_Chinhanh: data.ID_Chinhanh,
      ID_Nhompb: data.ID_Nhompb,
      Mapb: data.Mapb,
      Thuoc: data.Thuoc,
      Tenphongban: data.Tenphongban,
      Diachi: data.Diachi,
      Ghichu: data.Ghichu,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

// const deleteEnt_phongbanda = async (id) => {
//   const res = await Ent_Phongbanda.update(
//     { isDelete: 1 },
//     {
//       where: {
//         ID_Phongban: id,
//       },
//     }
//   );
//   return res;
// };


const deleteEnt_phongbanda = async (id) => {
  // Kiểm tra sự tồn tại của ID_Phongban trong bảng Ent_Phongbanda
  const phongban = await Ent_Phongbanda.findOne({ where: { ID_Phongban: id } });

  if (!phongban) {
    throw new Error("ID_Phongban không tồn tại trong bảng Ent_Phongbanda.");
  }

  // Kiểm tra xem ID_Phongban có tồn tại trong các bảng liên quan khác không
  const isInOtherTables = await checkRelatedTables(id);

  if (isInOtherTables) {
    throw new Error(
      "Không thể xóa, ID_Phongban tồn tại trong các bảng liên quan."
    );
  } else {
    // Cập nhật trạng thái isDelete nếu ID không tồn tại trong các bảng liên quan
    const res = await Ent_Phongbanda.update(
      { isDelete: 1 },
      {
        where: {
          ID_Phongban: id,
        },
      }
    );
    return res;
  }
};

const checkRelatedTables = async (id) => {
  const tables = [
    Ent_NhansuPBDA,
    Tb_GiaonhanTS,
    Tb_PhieuNX,
    Tb_SuachuaTS,
    Tb_TaisanQrCode,
    Tb_Tonkho
  ];

  const results = await Promise.all(
    tables.map(table => table.findOne({ where: { ID_Phongban: id } }))
  );

  return results.some(result => result !== null);
};

module.exports = {
  createEnt_phongbanda,
  getAllEnt_phongbanda,
  updateEnt_phongbanda,
  deleteEnt_phongbanda,
  getDetailEnt_phongbanda,
};
