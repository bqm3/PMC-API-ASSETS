const { Ent_Chinhanh } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_chinhanh = async (data) => {
  const res = await Ent_Chinhanh.create(data);
  return res;
};

const getAlleEnt_chinhanh = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Chinhanh.findAll({
    where: whereClause,
  });
  return res;
};

const updateleEnt_chinhanh = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Chinhanh: data.ID_Chinhanh,
  };

  const res = await Ent_Chinhanh.update(
    {
      Tenchinhanh: data.Tenchinhanh,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_chinhanh = async (id) => {
  const res = await Ent_Chinhanh.update(
    { isDelete: 1 },
    {
      where: {
        ID_Chinhanh: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_chinhanh,
  getAlleEnt_chinhanh,
  updateleEnt_chinhanh,
  deleteEnt_chinhanh,
};
