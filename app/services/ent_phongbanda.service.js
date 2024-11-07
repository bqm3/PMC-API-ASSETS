const {
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhompb,
  Ent_Duan,
} = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_phongbanda = async (data) => {
  const res = await Ent_Phongbanda.create(data);
  return res;
};

const check_phongbanda = async (Mapb, Tenphongban, Thuoc,  excludeId = null) => {
  const conditions = {
    [Op.or]: [
      { Mapb: Mapb },
      { Tenphongban: Tenphongban }
    ],
    Thuoc: Thuoc,
    isDelete: 0,
  };

  if (excludeId) {
    conditions.ID_Phongban = {
      [Op.ne]: excludeId 
    };
  }

  const existingRoom = await Ent_Phongbanda.findOne({
    where: conditions,
    attributes: ["ID_Phongban", "Mapb", "Tenphongban", "Thuoc", "isDelete"],
  });

  return existingRoom;
};


const getAllEnt_phongbanda = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Phongbanda.findAll({
    attributes: [
      "ID_Phongban",
      "ID_Chinhanh",
      "ID_Duan",
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
      {
        model: Ent_Duan,
        attributes: ["ID_Duan", "Duan", "isDelete"],
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
  let whereClause = {
    isDelete: 0,
    ID_Phongban: Number(data.ID_Phongban),
  };

  const res = await Ent_Phongbanda.update(
    {
      ID_Chinhanh: data.ID_Chinhanh,
      ID_Duan: data.ID_Duan,
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
  try {
    // Truy vấn danh sách các bảng có chứa cột ID_Phongban
    const [tables] = await sequelize.query(
      `SELECT table_name AS tableName
       FROM information_schema.columns
       WHERE column_name = 'ID_Phongban'
       AND table_name != 'Ent_PhongbanDa'
       AND table_schema = DATABASE()` 
    );

    // Duyệt qua các bảng tìm kiếm xem ID_Phongban có tồn tại hay không
    for (const table of tables) {
      const tableName = table.tableName;
  
      // Kiểm tra sự tồn tại của ID_Phongban trong từng bảng
      const [results] = await sequelize.query(
        `SELECT 1 FROM \`${tableName}\` WHERE ID_Phongban = :id LIMIT 1`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      if (results) {
        throw new Error(`Không thể xóa, ID_Phongban tồn tại trong bảng ${tableName}.`);
      }
    }

    // Nếu không có ID_Phongban trong bảng nào, cập nhật isDelete = 1
    const res = await Ent_Phongbanda.update(
      { isDelete: 1 },
      {
        where: {
          ID_Phongban: id,
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Lỗi khi xóa phòng ban:", error.message);
    throw error;
  }
};




module.exports = {
  createEnt_phongbanda,
  getAllEnt_phongbanda,
  updateEnt_phongbanda,
  deleteEnt_phongbanda,
  getDetailEnt_phongbanda,
  check_phongbanda,
};
