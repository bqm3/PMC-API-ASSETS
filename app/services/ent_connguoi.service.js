const {
  Ent_Connguoi,
  Ent_Nhompb,
  Ent_Chinhanh,
  Ent_NhansuPBDA,
  Ent_Phongbanda,
} = require("../models/setup.model");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const sequelize = require("../config/db.config");

const createEnt_connguoi = async (data) => {
  if (!data.user) {
    throw new Error("Không có quyền tạo thông tin.");
  }

  if (!data.MaPMC || !data.Hoten || !data.Sodienthoai) {
    throw new CustomError("400", "Thiếu thông tin dữ liệu.");
  }

  const findUser = await Ent_Connguoi.findOne({
    attributes: ["MaPMC", "isDelete"],
    where: {
      isDelete: 0,
      MaPMC: data.MaPMC,
    },
  });

  if (findUser) {
    throw new Error("Đã tồn tại mã PMC.");
  }

  const transaction = await sequelize.transaction(); // Bắt đầu giao dịch
  try {
    // Tạo bản ghi Ent_Connguoi
    const res = await Ent_Connguoi.create(
      {
        MaPMC: data.MaPMC,
        Hoten: data.Hoten,
        Gioitinh: data.Gioitinh,
        Diachi: data.Diachi,
        Sodienthoai: data.Sodienthoai,
        Ghichu: data.Ghichu,
        NgayGhinhan: data.NgayGhinhan,
        isDelete: 0,
      },
      { transaction }
    );

    // Tạo bản ghi Ent_NhansuPBDA
    await Ent_NhansuPBDA.create(
      {
        ID_Phongban: data.ID_Phongban,
        ID_Connguoi: res.ID_Connguoi,
        Ngayvao: data.NgayGhinhan,
        iTinhtrang: 1,
      },
      { transaction }
    );

    // Nếu cả hai đều thành công, commit giao dịch
    await transaction.commit();
    return res;
  } catch (error) {
    // Nếu có lỗi, rollback tất cả thay đổi
    await transaction.rollback();
    throw new Error(
      "Thông tin không chính xác hoặc đã xảy ra lỗi: " + error.message
    );
  }
};

const getDetailEnt_connguoi = async (data) => {
  if (data.user) {
    const res = await Ent_Connguoi.findByPk(data.ID_Connguoi, {
      attributes: [
        "ID_Connguoi",
        "MaPMC",
        "Hoten",
        "Gioitinh",
        "Diachi",
        "Sodienthoai",
        "Ghichu",
        "NgayGhinhan",
        "isDelete",
      ],
      where: { isDelete: 0 },
      include: [
        {
          model: Ent_NhansuPBDA,
          as: "ent_nhansupbda",
          attributes: [
            "ID_NSPB",
            "ID_Phongban",
            "ID_Connguoi",
            "Ngayvao",
            "iTinhtrang",
            "Ngay",
            "isDelete",
          ],
          required: false, // Allow null values
          include: [
            {
              model: Ent_Phongbanda,
              attributes: [
                "ID_Phongban",
                "ID_Chinhanh",
                "ID_Nhompb",
                "Mapb",
                "Thuoc",
                "Tenphongban",
                "Diachi",
                "Ghichu",
                "isDelete",
              ],
              required: false, // Allow null values
              include: [
                {
                  model: Ent_Chinhanh,
                  attributes: ["Tenchinhanh"],
                  required: false, // Allow null values
                },
                {
                  model: Ent_Nhompb,
                  attributes: ["Nhompb"],
                  required: false, // Allow null values
                },
              ],
            },
          ],
        },
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

const updateEnt_connguoi = async (data) => {
  if (data.user) {
    const reqData = {
      MaPMC: data.MaPMC,
      Hoten: data.Hoten,
      Gioitinh: data.Gioitinh,
      Diachi: data.Diachi,
      Sodienthoai: data.Sodienthoai,
      Ghichu: data.Ghichu,
      NgayGhinhan: data.NgayGhinhan,
      isDelete: 0,
    };
    if (!data.MaPMC || !data.Hoten || !data.Sodienthoai) {
      throw new CustomError("400", "Thiếu thông tin dữ liệu.");
    }

    if (data.ID_Phongban !== null) {
      const res = await Ent_NhansuPBDA.update(
        {
          isDelete: 1,
          Ngay: data.NgayGhinhan,
        },
        {
          where: {
            ID_Phongban: data.ID_Phongban,
            ID_Connguoi: data.ID_Connguoi,
          },
        }
      );
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
        "Hoten",
        "Gioitinh",
        "Diachi",
        "Sodienthoai",
        "Ghichu",
        "NgayGhinhan",
        "isDelete",
      ],
      where: { isDelete: 0 },
      include: [
        {
          model: Ent_NhansuPBDA,
          as: "ent_nhansupbda",
          attributes: [
            "ID_NSPB",
            "ID_Phongban",
            "ID_Connguoi",
            "Ngayvao",
            "iTinhtrang",
            "Ngay",
            "isDelete",
          ],
          required: false, // Allow null values
          include: [
            {
              model: Ent_Phongbanda,
              attributes: [
                "ID_Phongban",
                "ID_Chinhanh",
                "ID_Nhompb",
                "Mapb",
                "Thuoc",
                "Tenphongban",
                "Diachi",
                "Ghichu",
                "isDelete",
              ],
              where: {
                isDelete: 0,
              },
              required: false, // Allow null values
              include: [
                {
                  model: Ent_Chinhanh,
                  attributes: ["Tenchinhanh"],
                  required: false, // Allow null values
                },
                {
                  model: Ent_Nhompb,
                  attributes: ["Nhompb"],
                  required: false, // Allow null values
                },
              ],
            },
          ],
        },
      ],
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
  getDetailEnt_connguoi,
};
