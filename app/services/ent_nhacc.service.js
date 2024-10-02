const { Ent_Nhacc } = require("../models/setup.model");
const { Op } = require("sequelize");

const createEnt_Nhacc = async (data) => {
  const res = await Ent_Nhacc.create(data);
  return res;
};

const getDetailEnt_Nhacc = async (data) => {
  let whereClause = {
    isDelete: 0,
    [Op.or]: [
      { MaNhacc: data.MaNhacc },
      {
        TenNhacc: data.TenNhacc,
      },
      { Masothue: data.Masothue },
    ],
  };

  const res = await Ent_Nhacc.findOne({
    where: whereClause,
  });
  return res;
};


const getDetailByIDEnt_Nhacc = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhacc: !data.ID_Nhacc,
    [Op.or]: [
      { MaNhacc: data.MaNhacc },
      {
        TenNhacc: data.TenNhacc,
      },
      { Masothue: data.Masothue },
    ],
  };

  const res = await Ent_Nhacc.findOne({
    where: whereClause,
  });
  return res;
};

const getAllEnt_Nhacc = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Nhacc.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_Nhacc = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Nhacc: data.ID_Nhacc,
  };

  const res = await Ent_Nhacc.update(
    {
      MaNhacc: data.MaNhacc,
      TenNhacc: data.TenNhacc,
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

const deleteEnt_Nhacc = async (id) => {
  const res = await Ent_Nhacc.update(
    { isDelete: 1 },
    {
      where: {
        ID_Nhacc: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_Nhacc,
  getAllEnt_Nhacc,
  updateEnt_Nhacc,
  deleteEnt_Nhacc,
  getDetailEnt_Nhacc,
  getDetailByIDEnt_Nhacc,
};
