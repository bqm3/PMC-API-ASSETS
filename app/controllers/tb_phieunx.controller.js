const tbPhieuNXService = require("../services/tb_phieunx.service");
const tbPhieuNXCTService = require("../services/tb_phieunxct.service");
const tbPhieuNXNBCTService = require("../services/tb_phieunxnoibo.service");
const tbTaiSanQrService = require("../services/tb_taisanqrcode.service");
const eThangService = require("../services/ent_thang.service");
const eNamService = require("../services/ent_nam.service");
const Tb_PhieuNX = require("../models/tb_phieunx.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");
const Tb_Tonkho = require("../models/tb_tonkho.model");

const createTb_PhieuNX = async (req, res) => {
  const t = await sequelize.transaction(); // Bắt đầu transaction
  try {
    const user = req.user.data;
    const {
      ID_Nghiepvu,
      Sophieu,
      ID_NoiNhap,
      ID_NoiXuat,
      ID_Loainhom,
      NgayNX,
      Ghichu,
      ID_Quy,
      phieunxct,
    } = req.body;

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNX creation
    const reqData = {
      ID_Phongban: user.ID_Phongban,
      ID_Nghiepvu: ID_Nghiepvu,
      Sophieu: Sophieu,
      ID_NoiNhap: ID_NoiNhap,
      ID_NoiXuat: ID_NoiXuat,
      ID_Loainhom: ID_Loainhom,
      ID_Nam: Nam.ID_Nam,
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      ID_Quy: ID_Quy,
      iTinhtrang: 0,
      isDelete: 0,
    };

    // Check if the combination of ID_Nghiepvu and Sophieu already exists
    const checkPhieuNX = await Tb_PhieuNX.findOne({
      attributes: [
        "ID_Nghiepvu",
        "Sophieu",
        "ID_NoiNhap",
        "ID_NoiXuat",
        "iTinhtrang",
        "isDelete",
        "ID_Nam",
        "ID_Quy",
        "isDelete",
      ],
      where: {
        isDelete: 0,
        ID_Nghiepvu: ID_Nghiepvu,
        Sophieu: {
          [Op.like]: `%${Sophieu}%`,
        },
      },
      transaction: t, // Transaction scope
    });

    if (checkPhieuNX) {
      await t.rollback(); // Rollback if the record already exists
      return res.status(400).json({
        message: "Đã có phiếu tồn tại",
      });
    }

    // Skip Tb_Tonkho.findOne check for ID_Nghiepvu == 9
    if (ID_Nghiepvu !== "9") {
      if (phieunxct.length > 0 && phieunxct[0]?.ID_Taisan !== null) {
        for (const item of phieunxct) {
          const dataTonkho = await Tb_Tonkho.findOne({
            attributes: [
              "ID_Tonkho",
              "ID_Quy",
              "ID_Nam",
              "ID_Phongban",
              "ID_Taisan",
              "isDelete",
            ],
            where: {
              ID_Phongban: ID_NoiXuat || ID_NoiNhap,
              ID_Taisan: item.ID_Taisan,
              isDelete: 0,
              ID_Quy: ID_Quy,
              ID_Nam: Nam.ID_Nam,
            },
            transaction: t, // Transaction scope
          });

          if (dataTonkho) {
            await t.rollback(); // Rollback if asset already exists
            return res.status(400).json({
              message: "Tài sản đã tồn tại trước đó",
            });
          }
        }
      }
    }

    // Create Tb_PhieuNX
    let data = await tbPhieuNXService.createTb_PhieuNX(reqData, {
      transaction: t,
    });

    // Switch statement for ID_Nghiepvu cases with phieunxct validation
    if (
      phieunxct &&
      Array.isArray(phieunxct) &&
      phieunxct.length > 0 &&
      phieunxct[0]?.ID_Taisan !== null
    ) {
      switch (ID_Nghiepvu) {
        case "1":
          await tbPhieuNXCTService.createTb_PhieuNXCT(phieunxct, data, {
            transaction: t,
          });
          break;
        case "3":
          await tbPhieuNXNBCTService.createTb_PhieuNXNBCT(phieunxct, data, {
            transaction: t,
          });
          break;
        case "9":
          await tbPhieuNXCTService.createTb_PhieuNXCT(phieunxct, data, {
            transaction: t,
          });
          break;
        default:
          break;
      }
    }

    // Commit transaction if no errors
    await t.commit();

    // Send success response
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    // Rollback in case of error
    if (t) await t.rollback();
    console.error("Error in creating Tb_PhieuNX:", error);
    res
      .status(400)
      .json({
        message: error.message || "Đã xảy ra lỗi khi tạo phiếu nhập xuất",
      });
  }
};

const getDetailTb_PhieuNX = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;

    const data = await tbPhieuNXService.getDetailTb_PhieuNX(ID_PhieuNX);
    res.status(200).json({
      message: "Dữ liệu",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTb_PhieuNX = async (req, res) => {
  try {
    const data = await tbPhieuNXService.getAllTb_PhieuNX();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPhieuNXByUser = async (req, res) => {
  try {
    const userData = req.user.data;
    const ID_Quy = req.params.id;

    const data = await tbPhieuNXService.getPhieuNXByUser(
      userData.ID_User,
      ID_Quy
    );
    res.status(200).json({
      message: "Danh sách phiếu kiểm kê của nhân viên trong quý",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTb_PhieuNX = async (req, res) => {
  try {
    const user = req.user.data;
    const ID_PhieuNX = req.params.id;

    const {
      ID_Nghiepvu,
      Sophieu,
      ID_NoiNhap,
      ID_NoiXuat,
      ID_Loainhom,
      NgayNX,
      Ghichu,
      phieunxct,
      ID_Quy,
    } = req.body;

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNX creation
    const reqData = {
      ID_PhieuNX: ID_PhieuNX,
      ID_Nghiepvu: ID_Nghiepvu,
      Sophieu: Sophieu,
      ID_NoiNhap: ID_NoiNhap,
      ID_NoiXuat: ID_NoiXuat,
      ID_Nam: Nam.ID_Nam,
      ID_Loainhom: ID_Loainhom,
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      ID_Quy: ID_Quy,
      isDelete: 0,
    };

    const updatePhieuNXResult = await tbPhieuNXService.updateTb_PhieuNX(
      reqData
    );
    if (!updatePhieuNXResult) {
      return res.status(500).json({
        message: "Đã xảy ra lỗi khi cập nhật phiếu nhập xuất",
      });
    }

    // Update Tb_PhieuNXCT if `phieunxct` contains valid items
    if (
      Array.isArray(phieunxct) &&
      phieunxct.length > 0 &&
      phieunxct[0].ID_Taisan !== null
    ) {
      const updatePhieuNXCTResult = await tbPhieuNXCTService.updateTb_PhieuNXCT(
        phieunxct,
        ID_PhieuNX,
        reqData
      );
      if (!updatePhieuNXCTResult) {
        return res.status(500).json({
          message: "Đã xảy ra lỗi khi cập nhật chi tiết phiếu nhập xuất",
        });
      }
    }

    // Send success response
    res.status(200).json({
      message: "Cập nhật thành công",
      data: updatePhieuNXResult,
    });
  } catch (error) {
    // Handle errors
    console.error("Error in creating Tb_PhieuNX:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo phiếu nhập xuất" });
  }
};

const closeTb_PhieuNX = async (req, res) => {
  const transaction = await sequelize.transaction(); // Tạo transaction mới
  try {
    const user = req.user.data;
    const ID_PhieuNX = req.params.id;
    const {
      ID_Nghiepvu,
      Sophieu,
      ID_NoiNhap,
      ID_NoiXuat,
      NgayNX,
      Ghichu,
      phieunxct,
      ID_Quy,
    } = req.body;

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNX creation
    const reqData = {
      ID_PhieuNX: ID_PhieuNX,
      ID_Nghiepvu: ID_Nghiepvu,
      Sophieu: Sophieu,
      ID_NoiNhap: ID_NoiNhap,
      ID_NoiXuat: ID_NoiXuat,
      ID_Quy: ID_Quy,
      ID_Nam: Nam.ID_Nam,
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      isDelete: 0,
    };

    await tbPhieuNXService.closeTb_PhieuNX(ID_PhieuNX, { transaction });

    if (
      (ID_Nghiepvu == 1 || ID_Nghiepvu == 2) &&
      phieunxct[0].ID_Taisan !== null
    ) {
      await tbTaiSanQrService.insertDataToEntQRCode(phieunxct, reqData, {
        transaction,
      });
    }

    await transaction.commit();

    res.status(200).json({
      message: "Đóng thành công!",
    });
  } catch (error) {
    // Rollback nếu có lỗi
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

const closeFastTb_PhieuNX = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;
    // Prepare data for Tb_PhieuNX creation

    await tbPhieuNXService.closeTb_PhieuNX(ID_PhieuNX);

    res.status(200).json({
      message: "Khóa phiếu thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTb_PhieuNX = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;
    await tbPhieuNXService.deleteTb_PhieuNX(ID_PhieuNX);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTb_PhieuNX,
  getAllTb_PhieuNX,
  updateTb_PhieuNX,
  deleteTb_PhieuNX,
  getDetailTb_PhieuNX,
  closeTb_PhieuNX,
  getPhieuNXByUser,
  closeFastTb_PhieuNX,
};
