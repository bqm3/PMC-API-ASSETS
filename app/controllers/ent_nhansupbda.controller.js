const entNhansuPBDAService = require("../services/ent_nhansupbda.service");
const {
  Ent_NhansuPBDA,
  Ent_Connguoi,
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhompb,
} = require("../models/setup.model");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_NhansuPBDA = async (req, res) => {
  try {
    const { ID_Phongban, ID_Connguoi, Ngayvao, iTinhtrang, Ngay } = req.body;

    const reqData = {
      ID_Phongban: ID_Phongban,
      ID_Connguoi: ID_Connguoi,
      Ngayvao: Ngayvao,
      iTinhtrang: iTinhtrang,
      Ngay: Ngay,
      isDelete: 0,
    };

    const data = await entNhansuPBDAService.createEnt_NhansuPBDA(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const transferEnt_NhansuPBDA = async (req, res) => {
  try {
    const ID_NSPB = req.params.id;
    const { Ngay, ID_Connguoi, ID_Phongban, iTinhtrang } = req.body;
    const userData = req.user.data;

    if (!userData) {
      return res.status(500).json({
        message: "Không có thông tin nhân viên",
      });
    }

    const data = {
      Ngay,
      ID_Connguoi,
      ID_Phongban,
      iTinhtrang,
      isDelete: 1,
    };

    await Ent_NhansuPBDA.update(data, {
      where: {
        ID_NSPB: ID_NSPB,
      },
    })
      .then(async (data) => {
        await Ent_NhansuPBDA.create({
          ID_Phongban: ID_Phongban,
          ID_Connguoi: ID_Connguoi,
          Ngayvao: Ngay,
          isDelete: 0,
          iTinhtrang: 1,
        });

        res.status(200).json({
          message: "Cập nhật thành công",
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message || "Lỗi! Vui lòng thử lại sau.",
        });
      });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

const closeEnt_NhansuPBDA = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    const ID_NSPB = req.params.id;
    const { Ngay, ID_Connguoi, iTinhtrang } = req.body;
    const userData = req.user.data;

    if (!userData) {
      return res.status(500).json({
        message: "Không có thông tin nhân viên",
      });
    }

    const data = {
      Ngay,
      iTinhtrang,
      isDelete: 1,
    };

    // First update - updating Ent_Connguoi
    await Ent_Connguoi.update(
      { isDelete: 1 },
      {
        where: {
          ID_Connguoi: ID_Connguoi,
        },
        transaction, // Ensure it is part of the transaction
      }
    );

    // Second update - updating Ent_NhansuPBDA
    await Ent_NhansuPBDA.update(data, {
      where: {
        ID_NSPB: ID_NSPB,
      },
      transaction, // Ensure it is part of the transaction
    });

    await transaction.commit(); // Commit the transaction if all goes well

    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of an error
    res.status(500).json({
      message: error.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

const getAllEnt_NhansuPBDA = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    const userData = req.user.data;
    if (!userData) {
      return res.status(500).json({
        message: "Không có thông tin nhân viên",
      });
    }

    await Ent_NhansuPBDA.findAll({
      attributes: [
        "ID_NSPB",
        "ID_Phongban",
        "ID_Connguoi",
        "Ngayvao",
        "iTinhtrang",
        "Ngay",
        "isDelete",
      ],
      include: [
        {
          model: Ent_Connguoi,
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
          include: [
            {
              model: Ent_Chinhanh,
              attributes: ["Tenchinhanh"],
            },
            {
              model: Ent_Nhompb,
              attributes: ["Nhompb"],
            },
          ],
        },
      ],
    })
      .then((data) => {
        res.status(200).json({
          message: "Thành công",
          data: data,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message || "Lỗi! Vui lòng thử lại sau.",
        });
      });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of an error
    res.status(500).json({
      message: error.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

module.exports = {
  createEnt_NhansuPBDA,
  transferEnt_NhansuPBDA,
  closeEnt_NhansuPBDA,
  getAllEnt_NhansuPBDA
};
