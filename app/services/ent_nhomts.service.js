const { Ent_Nhomts, Ent_Loainhom } = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_nhomts = async (data) => {
  const findData = await Ent_Nhomts.findOne({
    attributes: [
      "ID_Nhomts",
      "ID_Loainhom",
      "Manhom",
      "Tennhom",
      "Ghichu",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Loainhom,
        as: "ent_loainhom",
        attributes: ["Loainhom"],
        where: { isDelete: 0 },
      },
    ],
    where: {
      isDelete: 0,
      Manhom: data.Manhom,
    },
  });

  if (findData) {
    throw new Error("Đã tồn tại mã tài sản.");
  }

  const res = await Ent_Nhomts.create(data);
  return res;
};

const getDetailEnt_taisan = async (ID) => {
  const res = await Ent_Nhomts.findByPk(ID, {
    attributes: ["ID_Nhomts", "ID_Loainhom", "Manhom", "Tennhom", "isDelete"],
    include: [
      {
        model: Ent_Loainhom,
        as: "ent_loainhom",
        attributes: ["Loainhom"],
        where: { isDelete: 0 },
      },
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};


const getAllEnt_nhomts = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Nhomts.findAll({
    attributes: ["ID_Nhomts", "ID_Loainhom", "Manhom", "Tennhom", "isDelete"],
    include: [
      {
        model: Ent_Loainhom,
        as: "ent_loainhom",
        attributes: ["Loainhom"],
      },
    ],
    where: whereClause,
  });
  return res;
};

const updateEnt_nhomts = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhomts: data.ID_Nhomts,
  };

  const filterData = await Ent_Nhomts.findOne({
    where: {
      isDelete: 0,
      ID_Nhomts: !data.ID_Nhomts,
      [Op.and]: [
        { Manhom: data.Manhom },
        {
          Tennhom: data.Tennhom,
        },
      ],
    },
  });

  if(filterData){
    throw new Error("Đã tồn tại nhóm tài sản."); 
  }

  const res = await Ent_Nhomts.update(
    {
      Manhom: data.Manhom,
      ID_Loainhom: data.ID_Loainhom,
      Tennhom: data.Tennhom,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_nhomts = async (id) => {
  const [tables] = await sequelize.query(
    `SELECT table_name AS tableName
     FROM information_schema.columns
     WHERE column_name = 'ID_Nhomts'
     AND table_name != 'Ent_Nhomts'
     AND table_schema = DATABASE()` 
  );

  for (const table of tables) {
    const tableName = table.tableName;
    console.log(tableName)
    const [results] = await sequelize.query(
      `SELECT 1 FROM \`${tableName}\` WHERE ID_Nhomts = :id LIMIT 1`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (results) {
      throw new Error(`Không thể xóa, ID_Nhomts tồn tại trong bảng ${tableName}.`);
    }
  }

  const res = await Ent_Nhomts.update(
    { isDelete: 1 },
    {
      where: {
        ID_Nhomts: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_nhomts,
  getAllEnt_nhomts,
  updateEnt_nhomts,
  deleteEnt_nhomts,
  getDetailEnt_taisan,
};
