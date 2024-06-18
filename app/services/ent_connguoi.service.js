const { Ent_Connguoi, Ent_Nhompb } = require("../models/setup.model");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");

const createEnt_connguoi = async (data) => {
  if (data.user) {
    const reqData = {
      MaPMC: data.MaPMC,
      ID_Nhompb: data.ID_Nhompb,
      Hoten: data.Hoten,
      Gioitinh: data.Gioitinh,
      Diachi: data.Diachi,
      Sodienthoai: data.Sodienthoai,
      Ghichu: data.Ghichu,
      isDelete: 0,
    };
    if (!data.MaPMC || !data.Hoten || !data.Sodienthoai) {
      throw new CustomError("400", "Thiếu thông tin dữ liệu.");
    }
    const res = await Ent_Connguoi.create(reqData);
    return res;
  } else {
    throw new Error("Không có quyền tạo thông tin.");
  }
};

const getDetailEnt_connguoi = async(data)=> {
  if (data.user) {
    const res = await Ent_Connguoi.findByPk(data.ID_Connguoi,{
      attributes: [
        "ID_Connguoi",
        "MaPMC",
        "ID_Nhompb",
        "Hoten",
        "Gioitinh",
        "Diachi",
        "Sodienthoai",
        "Ghichu",
      ],
      include: [
        {
          model: Ent_Nhompb,
          attributes: [
            "ID_Nhompb", "Nhompb", "isDelete"
          ],
          where: {
            isDelete: 0
          }
        }
      ],
      where: {
        isDelete: 0,
      },
    });
    return res;
  } else {
    throw new Error("Không có quyền tạo thông tin.");
  }
}

const updateEnt_connguoi = async (data) => {
  if (data.user) {
    const reqData = {
      MaPMC: data.MaPMC,
      ID_Nhompb: data.ID_Nhompb,
      Hoten: data.Hoten,
      Gioitinh: data.Gioitinh,
      Diachi: data.Diachi,
      Sodienthoai: data.Sodienthoai,
      Ghichu: data.Ghichu,
      isDelete: 0,
    };
    if (!data.MaPMC || !data.Hoten || !data.Sodienthoai) {
      throw new CustomError("400", "Thiếu thông tin dữ liệu.");
    }
    const res = await Ent_Connguoi.update(reqData, {
      where: {
        ID_Connguoi: data.ID_Connguoi,
      },
    });
    return res;
  } else {
    throw new Error("Không có quyền tạo thông tin.");
  }
};

const getAllEnt_connguoi = async (user) => {
  if (user) {
    const res = await Ent_Connguoi.findAll({
      attributes: [
        "ID_Connguoi",
        "MaPMC",
        "ID_Nhompb",
        "Hoten",
        "Gioitinh",
        "Diachi",
        "Sodienthoai",
        "Ghichu",
      ],
      include: [
        {
          model: Ent_Nhompb,
          attributes: [
            "ID_Nhompb", "Nhompb", "isDelete"
          ],
          where: {
            isDelete: 0
          }
        }
      ],
      where: {
        isDelete: 0,
      },
    });
    return res;
  } else {
    throw new Error("Không có quyền tạo thông tin.");
  }
};

const deleteEnt_connguoi = async (data) => {
  if (data.user) {
    const res = await Ent_Connguoi.update(
      {
        isDelete: 1,
      },
      {
        where: {
          ID_Connguoi: data.ID_Connguoi,
        },
      }
    );
    return res;
  } else {
    throw new Error("Không có quyền tạo thông tin.");
  }
};

module.exports = {
  createEnt_connguoi,
  updateEnt_connguoi,
  getAllEnt_connguoi,
  deleteEnt_connguoi,
  getDetailEnt_connguoi
};
