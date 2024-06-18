const { Ent_Policy, Ent_GroupPolicy } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_Policy = async (data) => {
  const res = await Ent_Policy.create(data);
  return res;
};

const getAllEnt_Policy = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Policy.findAll({
    attributes: [
      "ID_Policy",
      "Policy",
      "ID_GroupPolicy",
      "GroupPolicy",
    ],
    include: [
      {
        model: Ent_GroupPolicy,
        attributes: ["GroupPolicy", "isDelete"],
        where: {
          isDelete: 0
        }
      },
    ],
    where: whereClause,
  });
  return res;
};

const updateEnt_Policy = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Policy: data.ID_Policy,
  };

  const res = await Ent_Policy.update(
    {
      Policy: data.Policy,
      ID_GroupPolicy: data.ID_GroupPolicy,
      GroupPolicy: data.GroupPolicy,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_Policy = async (ID) => {
  const res = await Ent_Policy.update(
    { isDelete: 1 },
    {
      where: {
        ID_Policy: ID,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_Policy,
  getAllEnt_Policy,
  updateEnt_Policy,
  deleteEnt_Policy,
};
