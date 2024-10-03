const { Ent_Nhacc } = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_Nhacc = async (data) => {
  const res = await Ent_Nhacc.create(data);
  return res;
};

const getDetailEnt_Nhacc = async (data) => {
  let whereClause = {
    isDelete: 0,
    [Op.or]: [
      { MaNhacc: data.MaNhacc },
      {
        TenNhacc: data.TenNhacc,
      },
      { Masothue: data.Masothue },
    ],
  };

  const res = await Ent_Nhacc.findOne({
    where: whereClause,
  });
  return res;
};

const getDetailByIDEnt_Nhacc = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhacc: !data.ID_Nhacc,
    [Op.or]: [
      { MaNhacc: data.MaNhacc },
      {
        TenNhacc: data.TenNhacc,
      },
      { Masothue: data.Masothue },
    ],
  };

  const res = await Ent_Nhacc.findOne({
    where: whereClause,
  });
  return res;
};

const getAllEnt_Nhacc = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Nhacc.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_Nhacc = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhacc: data.ID_Nhacc,
  };

  const res = await Ent_Nhacc.update(
    {
      MaNhacc: data.MaNhacc,
      TenNhacc: data.TenNhacc,
      Masothue: data.Masothue,
      Sodienthoai: data.Sodienthoai,
      Sotaikhoan: data.Sotaikhoan,
      Nganhang: data.Nganhang,
      Diachi: data.Diachi,
      Ghichu: data.Ghichu,
      isDelete: 0,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

// const deleteEnt_Nhacc = async (id) => {
//   const res = await Ent_Nhacc.update(
//     { isDelete: 1 },
//     {
//       where: {
//         ID_Nhacc: id,
//       },
//     }
//   );
//   return res;
// };

const deleteEnt_Nhacc = async (id) => {
  try {
    const [tables] = await sequelize.query(
      `SELECT table_name AS tableName
     FROM information_schema.columns
     WHERE column_name = 'ID_Nhacc'
     AND table_name != 'Ent_Nhacc'
     AND table_schema = DATABASE()`
    );

    for (const table of tables) {
      const tableName = table.TABLE_NAME;

      const [results] = await sequelize.query(
        `SELECT 1 FROM ${tableName} WHERE ID_Nhacc = :id LIMIT 1`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (results && results.length > 0) {
        throw new Error(
          `Không thể xóa, ID_Nhacc tồn tại trong bảng ${tableName}.`
        );
      }
    }

    const res = await Ent_Nhacc.update(
      { isDelete: 1 },
      {
        where: {
          ID_Nhacc: id,
        },
      }
    );
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEnt_Nhacc,
  getAllEnt_Nhacc,
  updateEnt_Nhacc,
  deleteEnt_Nhacc,
  getDetailEnt_Nhacc,
  getDetailByIDEnt_Nhacc,
};
