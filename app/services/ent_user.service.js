const {
  Ent_User,
  Ent_Nhompb,
  Ent_Chinhanh,
  Ent_Chucvu,
  Ent_GroupPolicy,
  Ent_Phongbanda,
} = require("../models/setup.model");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { Op } = require("sequelize");
const { uploadFile } = require("../middleware/image.middleware");
const CustomError = require("../utils/CustomError");

const register = async (data) => {
  const user = await Ent_User.findOne({
    where: {
      isDelete: 0,
      [Op.or]: [{ MaPMC: data.MaPMC }, { Sodienthoai: data.Sodienthoai }],
    },
  });

  if (user) {
    throw new Error("Thông tin Mã PMC hoặc Số điện thoại đã bị trùng.");
  } else {
    let resData = null;
    if (data.ID_Phongban) {
      resData = await Ent_Phongbanda.findByPk(data.ID_Phongban, {
        attributes: ["ID_Phongban", "ID_Chinhanh", "ID_Nhompb", "isDelete"],
        where: {
          isDelete: 0,
        },
      });
    }

    if (resData) {
      const salt = genSaltSync(10);
      var reqData = {
        ID_Nhompb: resData.ID_Nhompb,
        ID_Chinhanh: resData.ID_Chinhanh,
        ID_Chucvu: data.ID_Chucvu,
        ID_Phongban: data.ID_Phongban,
        IDNHOMNGUOIDUNG: data.IDNHOMNGUOIDUNG ? data.IDNHOMNGUOIDUNG : null,
        MaPMC: data.MaPMC,
        Hoten: data.Hoten,
        ID_Phongban: data.ID_Phongban,
        Gioitinh: data.Gioitinh,
        Diachi: data.Diachi,
        Password: await hashSync(`${data.Password}`, salt),
        Sodienthoai: data.Sodienthoai,
        Emails: data.Emails,
        Ghichu: data.Ghichu,
        isDelete: 0,
      };
      const res = await Ent_User.create(reqData);
      return res;
    } else {
      throw new Error("Lỗi! Không tạo được thông tin tài khoản");
    }
  }
};

const login = async (data) => {
  try {
    const { MaPMC, Password } = data;

    if (!MaPMC || !Password) {
      throw new CustomError(
        "MISSING_CREDENTIALS",
        "MaPMC và Mật khẩu là bắt buộc."
      );
    }

    const user = await Ent_User.findOne({
      attributes: [
        "ID_User",
        "ID_Nhompb",
        "ID_Chinhanh",
        "ID_Policy",
        "ID_Chucvu",
        "MaPMC",
        "Hoten",
        "Gioitinh",
        "Password",
        "Diachi",
        "Sodienthoai",
        "Emails",
        "Anh",
        "isDelete",
        "ID_Phongban",
      ],
      include: [
        {
          model: Ent_Nhompb,
          attributes: ["ID_Nhompb", "Nhompb"],
        },
        {
          model: Ent_Chinhanh,
          attributes: ["Tenchinhanh"],
        },
        {
          model: Ent_Chucvu,
          attributes: ["Chucvu"],
        },
        {
          model: Ent_Phongbanda,
          attributes: ["ID_Phongban", "Tenphongban"],
        },
      ],
      where: {
        MaPMC: MaPMC,
        isDelete: 0,
      },
    });

    if (user && user.isDelete === 0) {
      const passwordValid = await bcrypt.compare(Password, user.Password);

      if (passwordValid) {
        // Generate JWT token
        const token = jsonwebtoken.sign(
          {
            userId: user.ID_User,
            data: user,
          },
          process.env.JWT_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "7d",
          }
        );

        return { token, user };
      } else {
        // Incorrect password
        throw new CustomError(
          "INVALID_PASSWORD",
          "Sai mật khẩu, vui lòng thử lại."
        );
      }
    } else {
      throw new CustomError(
        "USER_NOT_FOUND",
        "Không tồn tại tài khoản đăng nhập."
      );
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      console.log("error", error);
      throw new CustomError(
        "INTERNAL_SERVER_ERROR",
        "Có lỗi trong quá trình đăng nhập."
      );
    }
  }
};

const checkAuth = async (ID) => {
  if (ID) {
    const res = await Ent_User.findByPk(ID, {
      attributes: [
        "ID_User",
        "ID_Nhompb",
        "ID_Chinhanh",
        "ID_Phongban",
        "MaPMC",
        "Hoten",
        "Gioitinh",
        "Diachi",
        "Sodienthoai",
        "Emails",
        "Anh",
        "isDelete",
        "ID_Chucvu",
      ],
      include: [
        {
          model: Ent_Nhompb,
          attributes: ["ID_Nhompb", "Nhompb"],
        },
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
        },
        {
          model: Ent_Chinhanh,
          attributes: ["Tenchinhanh"],
        },
        {
          model: Ent_Chucvu,
          attributes: ["Chucvu"],
        },
      ],
      where: {
        isDelete: 0,
      },
    });

    return res;
  } else {
    throw new Error("Không thể đổi mật khẩu.");
  }
};

const changePassword = async (data) => {
  if (data.user) {
    const isPasswordValid = await compareSync(
      data.currentPassword,
      data.user.Password
    );
    if (!isPasswordValid) {
      throw new Error("Sai mật khẩu.");
    }

    const hashedNewPassword = await hashSync(data.newPassword, 10);
    const res = await Ent_User.update(
      {
        Password: hashedNewPassword,
      },
      {
        where: {
          ID_User: data.user.ID_User,
        },
      }
    );
    return res;
  } else {
    throw new Error("Không thể đổi mật khẩu.");
  }
};

const updateProfile = async (data) => {
  if (data.user) {
    const file = await uploadFile(data.images);
    let updateData = {
      ID_Nhompb: data.ID_Nhompb,
      ID_Chinhanh: data.ID_Chinhanh,
      ID_Chucvu: data.ID_Chucvu,
      ID_Loainhom: data.ID_Loainhom,
      MaPMC: data.MaPMC,
      Hoten: data.Hoten,
      ID_Phongban: data.ID_Phongban,
      Gioitinh: data.Gioitinh,
      Diachi: data.Diachi,
      Sodienthoai: data.Sodienthoai,
      Emails: data.Emails,
      Ghichu: data.Ghichu,
      Anh: file ? file.id : "",
    };
    const res = await Ent_User.update(updateData, {
      where: {
        ID_User: data.user.ID_User,
      },
    });
    return res;
  } else {
    throw new Error("Không thể đổi mật khẩu.");
  }
};

const getAll = async () => {
  const res = await Ent_User.findAll({
    attributes: [
      "ID_User",
      "ID_Nhompb",
      "ID_Chinhanh",
      "ID_Phongban",
      "IDNHOMNGUOIDUNG",
      "ID_Chucvu",
      "MaPMC",
      "Password",
      "Hoten",
      "Gioitinh",
      "Diachi",
      "Sodienthoai",
      "Emails",
      "Anh",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Nhompb,
        attributes: ["ID_Nhompb", "Nhompb"],
      },
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
      },
      {
        model: Ent_Chinhanh,
        attributes: ["Tenchinhanh"],
      },
      {
        model: Ent_Chucvu,
        attributes: ["Chucvu"],
      },
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};

const getDetail = async (ID_User) => {
  const res = await Ent_User.findByPk(ID_User, {
    attributes: [
      "ID_User",
      "ID_Nhompb",
      "ID_Chinhanh",
      "ID_Phongban",
      "IDNHOMNGUOIDUNG",
      "ID_Chucvu",
      "Password",
      "MaPMC",
      "Hoten",
      "Gioitinh",
      "Diachi",
      "Sodienthoai",
      "Emails",
      "Anh",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Nhompb,
        attributes: ["ID_Nhompb", "Nhompb"],
      },
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
      },
      {
        model: Ent_Chinhanh,
        attributes: ["Tenchinhanh"],
      },
      {
        model: Ent_Chucvu,
        attributes: ["Chucvu"],
      },
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};

const updateUser = async (data) => {
  if (data) {
    let resData = null;
    if (data.ID_Phongban) {
      resData = await Ent_Phongbanda.findByPk(data.ID_Phongban, {
        attributes: ["ID_Phongban", "ID_Chinhanh", "ID_Nhompb", "isDelete"],
        where: {
          isDelete: 0,
        },
      });
    }

    if (resData) {
      let updateData = {
        ID_Nhompb: resData.ID_Nhompb,
        ID_Chinhanh: resData.ID_Chinhanh,
        ID_Chucvu: data.ID_Chucvu,
        IDNHOMNGUOIDUNG: data.IDNHOMNGUOIDUNG ? data.IDNHOMNGUOIDUNG : null,
        MaPMC: data.MaPMC,
        Hoten: data.Hoten,
        ID_Phongban: data.ID_Phongban,
        Gioitinh: data.Gioitinh,
        Diachi: data.Diachi,
        Sodienthoai: data.Sodienthoai,
        Emails: data.Emails,
        Ghichu: data.Ghichu,
      };
      const res = await Ent_User.update(updateData, {
        where: {
          ID_User: data.ID_User,
        },
      });
      return res;
    }
  } else {
    throw new Error("Không thể đổi mật khẩu.");
  }
};

module.exports = {
  login,
  register,
  changePassword,
  updateProfile,
  checkAuth,
  getAll,
  getDetail,
  updateUser,
};
