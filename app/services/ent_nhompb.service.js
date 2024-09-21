const { Ent_Nhompb } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_nhompb = async (data) => {
  const res = await Ent_Nhompb.create(data);
  return res;
};

const getAllEnt_nhompb = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Nhompb.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_nhompb = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhompb: data.ID_Nhompb,
  };

  const res = await Ent_Nhompb.update(
    {
      Nhompb: data.Nhompb,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_nhompb = async (id) => {
  const res = await Ent_Nhompb.update(
    { isDelete: 1 },
    {
      where: {
        ID_Nhompb: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_nhompb,
  getAllEnt_nhompb,
  updateEnt_nhompb,
  deleteEnt_nhompb,
};
