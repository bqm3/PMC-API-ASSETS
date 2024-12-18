const {
  Ent_Taisan,
  Ent_Chinhanh,
  Ent_Nhompb,
  Ent_Nhomts,
  Ent_Donvi,
  Ent_Loainhom,
  Ent_Hang,
} = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");
const { removeVietnameseTones } = require("../utils/utils");

const createEnt_taisan = async (data) => {
  const res = await Ent_Taisan.create(data);
  return res;
};

const findTaisan = async (data, excludeId = null) => {
  const conditions = {
    isDelete: 0,
    [Op.or]: [
      {
        Tents: sequelize.where(
          sequelize.fn("UPPER", sequelize.fn("TRIM", sequelize.col("Tents"))),
          "LIKE",
          `%${data?.Tents?.trim()?.toUpperCase()}%`
        ),
      },
      {
        Model: sequelize.where(
          sequelize.fn("UPPER", sequelize.fn("TRIM", sequelize.col("Model"))),
          "LIKE",
          `%${data.Model?.trim()?.toUpperCase()}%`
        ),
      },
      {
        SerialNumber: sequelize.where(
          sequelize.fn(
            "UPPER",
            sequelize.fn("TRIM", sequelize.col("SerialNumber"))
          ),
          "LIKE",
          `%${data.SerialNumber?.trim()?.toUpperCase()}%`
        ),
      },
    ],
  };
  if (excludeId) {
    conditions.ID_Taisan = {
      [Op.ne]: excludeId,
    };
  }

  const res = await Ent_Taisan.findOne({
    attributes: [
      "ID_Taisan",
      "ID_Nhomts",
      "ID_Donvi",
      "ID_Hang",
      "Tentscu",
      "i_MaQrCode",
      "Mats",
      "Tents",
      "Thongso",
      "SerialNumber",
      "Model",
      "Nuocsx",
      "Ghichu",
      "isDelete",
    ],
    where: conditions,
  });
  return res;
};

// ra danh sách phiếu thuộc phong ban ng đó, phân quyền,, vào tài khoản vip thì xemd c hết, còn vào tài khoản có ID Phongban thì xem dc phòng ban đó thôi
// 1 list chưa khóa, còn khóa r thì thôi

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
      "ID_Hang",
      "Mats",
      "Tents",
      "Thongso",
      "Model",
      "SerialNumber",
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
        include: [
          {
            model: Ent_Loainhom,
            as: "ent_loainhom",
            attributes: ["ID_Loainhom", "Loainhom"],
          },
        ],
      },
      {
        model: Ent_Donvi,
        attributes: ["ID_Donvi", "Donvi", "isDelete"],
        where: { isDelete: 0 },
      },
      {
        model: Ent_Hang,
        attributes: ["ID_Hang", "Tenhang", "isDelete"],
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
    [Op.or]: [{ Mats: Mats }, { Tents: Tents }],
    isDelete: 0,
  };

  // Nếu excludeId có giá trị, thêm điều kiện để loại trừ bản ghi đó
  if (excludeId) {
    conditions.ID_Taisan = {
      [Op.ne]: excludeId, // Không lấy bản ghi có ID bằng excludeId
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

  const filterData = await findTaisan(data, data.ID_Taisan);
  if (filterData) {
    if (
      data.Tents &&
      filterData.Tents &&
      removeVietnameseTones(filterData.Tents) ===
        removeVietnameseTones(data.Tents)
    ) {
      throw new Error(`Đã tồn tại tên tài sản: ${data.Tents} trong tài sản: ${filterData.Tents}`);
    }

    if (
      data.Model &&
      filterData.Model &&
      removeVietnameseTones(filterData.Model) ===
        removeVietnameseTones(data.Model)
    ) {
      throw new Error(`Đã tồn tại model tài sản: ${data.Model} trong tài sản: ${filterData.Tents}`);
    }

    if (
      data.SerialNumber &&
      filterData.SerialNumber &&
      removeVietnameseTones(filterData.SerialNumber) ===
        removeVietnameseTones(data.SerialNumber)
    ) {
      throw new Error(`Đã tồn tại serial number tài sản: ${data.SerialNumber} trong tài sản: ${filterData.Tents}`);
    }
  }

  const res = await Ent_Taisan.update(
    {
      ID_Nhomts: data.ID_Nhomts,
      ID_Donvi: data.ID_Donvi,
      ID_Hang: data.ID_Hang,
      Mats: data.Mats,
      Tents: data.Tents,
      Thongso: data.Thongso,
      Nuocsx: data.Nuocsx,
      Model: data.Model,
      SerialNumber: data.SerialNumber,
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
  findTaisan,
};
