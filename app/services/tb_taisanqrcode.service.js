const {
  Tb_TaisanQrCode,
  Ent_Taisan,
  Ent_Nhomts,
  Ent_Donvi,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createTb_taisanqrcode = async (data) => {
  const res = await Tb_TaisanQrCode.create(data);
  return res;
};

const getAlleTb_taisanqrcode = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Tb_TaisanQrCode.findAll({
    attributes: [
      "ID_TaisanQrCode",
      "ID_Taisan",
      "MaQrCode",
      "Ngaykhoitao",
      "iTinhtrang",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Taisan,
        as: "ent_taisan",
        attributes: [
          "ID_Taisan",
          "ID_Nhomts",
          "ID_Donvi",
          "Mats",
          "Tents",
          "Thongso",
          "Ghichu",
          "isDelete",
        ],
        include: [
          {
            model: Ent_Nhomts,
            as: "ent_nhomts",
            attributes: ["ID_Loaits", "Manhom", "Loaits", "isDelete"],
            where: { isDelete: 0 },
          },
          {
            model: Ent_Donvi,
            as: "ent_donvi",
            attributes: ["ID_Donvi", "Donvi", "isDelete"],
            where: { isDelete: 0 },
          },
        ],
        where: { isDelete: 0 },
      },
    ],
    where: whereClause,
  });
  return res;
};

const getDetailTb_taisanqrcode = async (id) => {
  const res = await Tb_TaisanQrCode.findByPk(id, {
    attributes: [
      "ID_TaisanQrCode",
      "ID_Taisan",
      "MaQrCode",
      "Ngaykhoitao",
      "iTinhtrang",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Taisan,
        as: "ent_taisan",
        attributes: [
          "ID_Taisan",
          "ID_Nhomts",
          "ID_Donvi",
          "Mats",
          "Tents",
          "Thongso",
          "Ghichu",
          "isDelete",
        ],
        include: [
          {
            model: Ent_Nhomts,
            as: "ent_nhomts",
            attributes: ["ID_Loaits", "Manhom", "Loaits", "isDelete"],
            where: { isDelete: 0 },
          },
          {
            model: Ent_Donvi,
            as: "ent_donvi",
            attributes: ["ID_Donvi", "Donvi", "isDelete"],
            where: { isDelete: 0 },
          },
        ],
        where: { isDelete: 0 },
      },
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};

const updateleTb_taisanqrcode = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_TaisanQrCode: data.ID_TaisanQrCode,
  };

  const res = await Tb_TaisanQrCode.update(
    {
      ID_Taisan: data.ID_Taisan,
      MaQrCode: data.MaQrCode,
      Ngaykhoitao: data.Ngaykhoitao,
      iTinhtrang: data.iTinhtrang,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteTb_taisanqrcode = async (id) => {
  const res = await Tb_TaisanQrCode.update(
    { isDelete: 1 },
    {
      where: {
        ID_TaisanQrCode: id,
      },
    }
  );
  return res;
};

module.exports = {
  createTb_taisanqrcode,
  getAlleTb_taisanqrcode,
  updateleTb_taisanqrcode,
  deleteTb_taisanqrcode,
  getDetailTb_taisanqrcode,
};
