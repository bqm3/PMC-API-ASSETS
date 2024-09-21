const { Ent_Donvi } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_donvi = async (data) => {
  const res = await Ent_Donvi.create(data);
  return res;
};

const getAllEnt_donvi = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Donvi.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_donvi = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Donvi: data.ID_Donvi,
  };

  const res = await Ent_Donvi.update(
    {
      Donvi: data.Donvi,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_donvi = async (id) => {
  const res = await Ent_Donvi.update(
    { isDelete: 1 },
    {
      where: {
        ID_Donvi: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_donvi,
  getAllEnt_donvi,
  updateEnt_donvi,
  deleteEnt_donvi,
};
