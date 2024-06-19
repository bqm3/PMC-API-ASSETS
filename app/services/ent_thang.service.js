const { Ent_Thang } = require("../models/setup.model");
const { Op } = require("sequelize");

const getAllEnt_thang = async () => {
  const res = await Ent_Thang.findAll();
  return res;
};

const getDetail = async (data) => {
  const exampleDate = new Date(data);
  const iThang = exampleDate.getMonth() + 1;
  const res = await Ent_Thang.findOne({
    where: {
      iThang: iThang,
    },
    attributes: ["ID_Thang", "Thang", "iThang"],
  });

  return res;
};

module.exports = {
  getAllEnt_thang,
  getDetail,
};
