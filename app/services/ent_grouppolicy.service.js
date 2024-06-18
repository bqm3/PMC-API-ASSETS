const { Ent_GroupPolicy } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_GroupPolicy = async (data) => {
  const res = await Ent_GroupPolicy.create(data);
  return res;
};

const getAllEnt_GroupPolicy = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_GroupPolicy.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_GroupPolicy = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_GroupPolicy: data.ID_GroupPolicy,
  };

  const res = await Ent_GroupPolicy.update(
    {
      GroupPolicy: data.GroupPolicy,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_GroupPolicy = async (id) => {
  const res = await Ent_GroupPolicy.update(
    { isDelete: 1 },
    {
      where: {
        ID_GroupPolicy: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_GroupPolicy,
  getAllEnt_GroupPolicy,
  updateEnt_GroupPolicy,
  deleteEnt_GroupPolicy,
};
