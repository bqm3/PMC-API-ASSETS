const { Ent_Nam } = require("../models/setup.model");
const { Op } = require("sequelize");


const getAllEnt_nam = async () => {
 

  const res = await Ent_Nam.findAll();
  return res;
};

const getDetail = async (data) => {
  const exampleDate = new Date(data);
  const year = exampleDate.getFullYear();
  const res = await Ent_Nam.findOne({
    where: {
      Giatri: year,
    },
    attributes: ["ID_Nam", "Nam", "Giatri"],
  });

  return res;
};

module.exports = {
  getAllEnt_nam,
  getDetail
};
