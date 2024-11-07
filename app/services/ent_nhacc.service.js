const { Ent_Nhacc } = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const create = async (data) => {
  const res = await Ent_Nhacc.create(data);
  return res;
};

const getDetail = async (data) => {
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

const getDetailByID = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhacc: {[Op.ne]: data.ID_Nhacc},
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

const getAll = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Nhacc.findAll({
    where: whereClause,
  });
  return res;
};

const update = async (data) => {
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
      Nguoilienhe: data.Nguoilienhe,
      Email: data.Email,
      Thanhpho: data.Thanhpho,
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

// const delete = async (id) => {
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

const deleteNhaCC = async (id) => {
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
  create,
  getAll,
  update,
  deleteNhaCC,
  getDetail,
  getDetailByID,
};
