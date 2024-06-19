const {
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhompb,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_phongbanda = async (data) => {
  const res = await Ent_Phongbanda.create(data);
  return res;
};

const getAlleEnt_phongbanda = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Phongbanda.findAll({
    attributes: [
      "ID_Phongban",
      "ID_Chinhanh",
      "ID_Nhompb",
      "Mapb", "Thuoc",
      "Tenphongban",
      "Diachi",
      "Ghichu",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Chinhanh,
        attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
        where: { isDelete: 0 },
      },
      {
        model: Ent_Nhompb,
        attributes: ["ID_Nhompb","Nhompb", "isDelete"],
        where: { isDelete: 0 },
      },
    ],
    where: whereClause,
  });
  return res;
};

const getDetailEnt_phongbanda = async (id) => {
  const res = await Ent_Phongbanda.findByPk(id, {
    attributes: [
      "ID_Phongban",
      "ID_Chinhanh",
      "ID_Nhompb",
      "Mapb", "Thuoc",
      "Tenphongban",
      "Diachi",
      "Ghichu",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Chinhanh,
        as: "ent_chinhanh",
        attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
        where: { isDelete: 0 },
      },
      {
        model: Ent_Nhompb,
        as: "ent_phongban",
        attributes: ["ID_Nhompb","Nhompb", "isDelete"],
        where: { isDelete: 0 },
      },
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};

const updateleEnt_phongbanda = async (data) => {
  console.log(data)
  let whereClause = {
    isDelete: 0,
    ID_Phongban: Number(data.ID_Phongban),
  };

  const res = await Ent_Phongbanda.update(
    {
      ID_Chinhanh: data.ID_Chinhanh,
      ID_Nhompb: data.ID_Nhompb,
      Mapb: data.Mapb,
      Tenphongban: data.Tenphongban,
      Diachi: data.Diachi,
      Ghichu: data.Ghichu,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_phongbanda = async (id) => {
  const res = await Ent_Phongbanda.update(
    { isDelete: 1 },
    {
      where: {
        ID_Phongban: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_phongbanda,
  getAlleEnt_phongbanda,
  updateleEnt_phongbanda,
  deleteEnt_phongbanda,
  getDetailEnt_phongbanda
};
