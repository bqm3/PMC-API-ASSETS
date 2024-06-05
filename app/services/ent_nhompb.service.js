const {
    Ent_Nhompb,
  } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_nhompb = async (data) => {
    const res = await Ent_Nhompb.create(data);
    return res;
};


module.exports = {
    createEnt_nhompb
}