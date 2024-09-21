const { Ent_NhansuPBDA } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_NhansuPBDA = async (data) => {
  const res = await Ent_NhansuPBDA.create(data);
  return res;
};

const getDetailEnt_NhansuPBDA = async (data) => {
  let whereClause = {
    isDelete: 0,
    [Op.or]: [
      { MaNhansuPBDA: data.MaNhansuPBDA },
      {
        TenNhansuPBDA: data.TenNhansuPBDA,
      },
      { Masothue: data.Masothue },
    ],
  };

  const res = await Ent_NhansuPBDA.findOne({
    where: whereClause,
  });
  return res;
};

const getDetailByIDEnt_NhansuPBDA = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_NhansuPBDA: !data.ID_NhansuPBDA,
    [Op.or]: [
      { MaNhansuPBDA: data.MaNhansuPBDA },
      {
        TenNhansuPBDA: data.TenNhansuPBDA,
      },
      { Masothue: data.Masothue },
    ],
  };

  const res = await Ent_NhansuPBDA.findOne({
    where: whereClause,
  });
  return res;
};

const getAllEnt_NhansuPBDA = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_NhansuPBDA.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_NhansuPBDA = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_NhansuPBDA: data.ID_NhansuPBDA,
  };

  const res = await Ent_NhansuPBDA.update(
    {
      MaNhansuPBDA: data.MaNhansuPBDA,
      TenNhansuPBDA: data.TenNhansuPBDA,
      Masothue: data.Masothue,
      Sodienthoai: data.Sodienthoai,
      Sotaikhoan: data.Sotaikhoan,
      Nganhang: data.Nganhang,
      Diachi: data.Diachi,
      Ghichu: data.Ghichu,
      isDelete: 0,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteEnt_NhansuPBDA = async (id) => {
  const res = await Ent_NhansuPBDA.update(
    { isDelete: 1 },
    {
      where: {
        ID_NhansuPBDA: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_NhansuPBDA,
  getAllEnt_NhansuPBDA,
  updateEnt_NhansuPBDA,
  deleteEnt_NhansuPBDA,
  getDetailEnt_NhansuPBDA,
  getDetailByIDEnt_NhansuPBDA,
};
