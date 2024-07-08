const { Ent_Chinhanh, Ent_Chucvu } = require("../models/setup.model");
const { Op } = require("sequelize");



const getAllEnt_chucvu = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Chucvu.findAll({
    where: whereClause,
  });
  return res;
};



module.exports = {
  getAllEnt_chucvu
};
