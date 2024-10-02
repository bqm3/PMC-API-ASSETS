const { Ent_Loainhom } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_Loainhom = async (data) => {
  const res = await Ent_Loainhom.create(data);
  return res;
};

const getAllEnt_Loainhom = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Loainhom.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_Loainhom = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Loainhom: data.ID_Loainhom,
  };

  const res = await Ent_Loainhom.update(
    {
      Loainhom: data.Loainhom,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_Loainhom = async (id) => {
  const res = await Ent_Loainhom.update(
    { isDelete: 1 },
    {
      where: {
        ID_Loainhom: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_Loainhom,
  getAllEnt_Loainhom,
  updateEnt_Loainhom,
  deleteEnt_Loainhom,
};
