const { Ent_Nghiepvu } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_nghiepvu = async (data) => {
  const res = await Ent_Nghiepvu.create(data);
  return res;
};

const getAlleEnt_nghiepvu = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Nghiepvu.findAll({
    where: whereClause,
  });
  return res;
};

const updateleEnt_nghiepvu = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nghiepvu: data.ID_Nghiepvu,
  };

  const res = await Ent_Nghiepvu.update(
    {
      Nghiepvu: data.Nghiepvu,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_nghiepvu = async (id) => {
  const res = await Ent_Nghiepvu.update(
    { isDelete: 1 },
    {
      where: {
        ID_Nghiepvu: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_nghiepvu,
  getAlleEnt_nghiepvu,
  updateleEnt_nghiepvu,
  deleteEnt_nghiepvu,
};
