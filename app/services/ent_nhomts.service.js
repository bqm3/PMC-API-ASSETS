const { Ent_Nhomts } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_nhomts = async (data) => {
  const res = await Ent_Nhomts.create(data);
  return res;
};

const getDetailEnt_taisan = async (ID)=> {
  const res = await Ent_Nhomts.findByPk(ID, {
    attributes: [
      "ID_Nhomts",
      "Manhom",
      "Loaits",
      "isDelete",
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
}

const getAlleEnt_nhomts = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Nhomts.findAll({
    where: whereClause,
  });
  return res;
};

const updateleEnt_nhomts = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhomts: data.ID_Nhomts,
  };

  const res = await Ent_Nhomts.update(
    {
      Manhom: data.Manhom,
      Loaits: data.Loaits,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_nhomts = async (id) => {
  const res = await Ent_Nhomts.update(
    { isDelete: 1 },
    {
      where: {
        ID_Nhomts: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_nhomts,
  getAlleEnt_nhomts,
  updateleEnt_nhomts,
  deleteEnt_nhomts,
  getDetailEnt_taisan
};
