const { Ent_Hang } = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_Hang = async (data) => {
  const find = await Ent_Hang.findOne({
    attributes: [
      "ID_Hang",
      "Tenhang",
      "isDelete",
    ],
    where: {
      isDelete: 0,
      Tenhang: sequelize.where(
        sequelize.fn(
          "UPPER",
          sequelize.fn("TRIM", sequelize.col("Tenhang"))
        ),
        "LIKE",
        data.Tenhang.trim().toUpperCase()
      ),
    },
  });
  if(find) {
    throw new Error("Đã tồn tại");
  }
  const res = await Ent_Hang.create(data);
  return res;
};

const getAllEnt_Hang = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Hang.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_Hang = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Hang: data.ID_Hang,
  };

  const res = await Ent_Hang.update(
    {
      Tenhang: data.Tenhang,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_Hang = async (id) => {
  const res = await Ent_Hang.update(
    { isDelete: 1 },
    {
      where: {
        ID_Hang: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_Hang,
  getAllEnt_Hang,
  updateEnt_Hang,
  deleteEnt_Hang,
};
