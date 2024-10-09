const {
  Ent_Taisan,
  Ent_Chinhanh,
  Ent_Nhompb,
  Ent_Nhomts,
  Ent_Donvi,
  Ent_Loainhom,
} = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_taisan = async (data) => {
  const res = await Ent_Taisan.create(data);
  return res;
};

const findTaisan = async (Tents) => {
  const res = await Ent_Taisan.findOne({
    attributes: [
      "ID_Taisan",
      "ID_Nhomts",
      "ID_Donvi",
      "Tentscu",
      "i_MaQrCode",
      "Mats",
      "Tents",
      "Thongso",
      "Nuocsx",
      "Ghichu",
      "isDelete",
    ],
    where: {
      isDelete: 0,
      Tents: sequelize.where(
        sequelize.fn(
          "UPPER",
          sequelize.fn("TRIM", sequelize.col("Tents"))
        ),
        "LIKE",
        Tents.trim().toUpperCase()
      ),
    },
  });
  return res;
}

const getAllEnt_taisan = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Taisan.findAll({
    attributes: [
      "ID_Taisan",
      "ID_Nhomts",
      "Tentscu",
      "i_MaQrCode",
      "ID_Donvi",
      "Mats",
      "Tents",
      "Thongso",
      "Nuocsx",
      "Ghichu",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Nhomts,
        as : "ent_nhomts",
        attributes: ["ID_Nhomts", "Manhom", "Tennhom", "isDelete"],
        where: { isDelete: 0 },
        include: [
          {
            model: Ent_Loainhom,
            as : "ent_loainhom",
            attributes: ["ID_Loainhom", "Loainhom"],
          }
        ]
      },
      {
        model: Ent_Donvi,
        attributes: ["ID_Donvi", "Donvi", "isDelete"],
        where: { isDelete: 0 },
      },
      
    ],
    where: whereClause,
  });
  return res;
};

const getDetailEnt_taisan = async (id) => {
  const res = await Ent_Taisan.findByPk(id, {
    attributes: [
      "ID_Taisan",
      "ID_Nhomts",
      "ID_Donvi",
      "Tentscu",
      "i_MaQrCode",
      "Mats",
      "Tents",
      "Thongso",
      "Nuocsx",
      "Ghichu",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Nhomts,
        as: "ent_nhomts",
        attributes: ["ID_Nhomts", "Manhom", "Tennhom", "isDelete"],
        where: { isDelete: 0 },
      },
      {
        model: Ent_Donvi,
        as: "ent_donvi",
        attributes: ["ID_Donvi", "Donvi", "isDelete"],
        where: { isDelete: 0 },
      },
      
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};

const check_taisan = async (Mats, Tents, excludeId = null) => {
  const conditions = {
    [Op.or]: [
      { Mats: Mats },
      { Tents: Tents }
    ],
    isDelete: 0,
  };

  // Nếu excludeId có giá trị, thêm điều kiện để loại trừ bản ghi đó
  if (excludeId) {
    conditions.ID_Taisan = {
      [Op.ne]: excludeId // Không lấy bản ghi có ID bằng excludeId
    };
  }

  const existingRoom = await Ent_Taisan.findOne({
    where: conditions,
    attributes: ["ID_Taisan"],
  });

  return existingRoom !== null;
};

const updateEnt_taisan = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Taisan: data.ID_Taisan,
  };

  const res = await Ent_Taisan.update(
    {
      ID_Nhomts: data.ID_Nhomts,
      ID_Donvi: data.ID_Donvi,
      Mats: data.Mats,
      Tents: data.Tents,
      Thongso: data.Thongso,
      Nuocsx: data.Nuocsx,
      Ghichu: data.Ghichu,
      Tentscu: data.Tentscu,
      i_MaQrCode: data.i_MaQrCode,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_taisan = async (id) => {
  const res = await Ent_Taisan.update(
    { isDelete: 1 },
    {
      where: {
        ID_Taisan: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_taisan,
  getAllEnt_taisan,
  updateEnt_taisan,
  deleteEnt_taisan,
  getDetailEnt_taisan,
  check_taisan,
  findTaisan
};
