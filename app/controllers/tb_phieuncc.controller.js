const tbPhieuNCCService = require("../services/tb_phieuncc.service");
const tbPhieuNCCCTService = require("../services/tb_phieunccct.service");
const tbTaiSanQrService = require("../services/tb_taisanqrcode.service");
const eThangService = require("../services/ent_thang.service");
const eNamService = require("../services/ent_nam.service");
const Tb_PhieuNCC = require("../models/tb_phieuncc.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createTb_PhieuNCC = async (req, res) => {
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

    // Prepare data for Tb_PhieuNCC creation
    const reqData = {
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

    const checkPhieuNX = await Tb_PhieuNCC.findOne({
      attributes: ["ID_Nghiepvu", "Sophieu", "ID_NoiNhap", "ID_NoiXuat", "iTinhtrang", "isDelete", "ID_Nam", "ID_Quy", "isDelete"],
      where: {
        [Op.or]: [
          {
            ID_Nam: Nam.ID_Nam,
            ID_Quy: ID_Quy,
            ID_Nghiepvu: ID_Nghiepvu,
            ID_NoiNhap: ID_NoiNhap,
            ID_NoiXuat: ID_NoiXuat,
            isDelete: 0,
          },
          {
            Sophieu: {
              [Op.like]: `%${Sophieu}%`
            }
          }
        ]
      }
    })
  
    if(checkPhieuNX) {
      return  res.status(400).json({
        message: "Đã có phiếu tồn tại",
      });
    }

    let data;

    // Create Tb_PhieuNCC
    data = await tbPhieuNCCService.createTb_PhieuNCC(reqData);

    // Create Tb_PhieuNCCCT
    if (
      phieunxct &&
      Array.isArray(phieunxct) &&
      phieunxct.length > 0 &&
      phieunxct[0]?.ID_Taisan !== null
    ) {
      await tbPhieuNCCCTService.createTb_PhieuNCCCT(phieunxct, data);
    }

    // Send success response
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    // Handle errors
    console.error("Error in creating Tb_PhieuNCC:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo phiếu nhập xuất" });
  }
};

const getDetailTb_PhieuNCC = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;

    const data = await tbPhieuNCCService.getDetailTb_PhieuNCC(ID_PhieuNX);
    res.status(200).json({
      message: "Dữ liệu",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTb_PhieuNCC = async (req, res) => {
  try {
    const data = await tbPhieuNCCService.getAllTb_PhieuNCC();
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

    const data = await tbPhieuNCCService.getPhieuNXByUser(
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

const updateTb_PhieuNCC = async (req, res) => {
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

    // Prepare data for Tb_PhieuNCC creation
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

    const updatePhieuNXResult = await tbPhieuNCCService.updateTb_PhieuNCC(
      reqData
    );
    if (!updatePhieuNXResult) {
      return res.status(500).json({
        message: "Đã xảy ra lỗi khi cập nhật phiếu nhập xuất",
      });
    }

    // Update Tb_PhieuNCCCT if `phieunxct` contains valid items
    if (
      Array.isArray(phieunxct) &&
      phieunxct.length > 0 &&
      phieunxct[0].ID_Taisan !== null
    ) {
      const updatePhieuNXCTResult = await tbPhieuNCCCTService.updateTb_PhieuNCCCT(
        phieunxct,
        ID_PhieuNX
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
    console.error("Error in creating Tb_PhieuNCC:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo phiếu nhập xuất" });
  }
};

const closeTb_PhieuNCC = async (req, res) => {
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
      ID_Quy
    } = req.body;

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNCC creation
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

    await tbPhieuNCCService.closeTb_PhieuNCC(ID_PhieuNX, { transaction });
    
    if (
      (ID_Nghiepvu == 1 || ID_Nghiepvu == 2) &&
      phieunxct[0].ID_Taisan !== null
    ) {
      await tbTaiSanQrService.insertDataToEntQRCode(phieunxct, reqData, { transaction });
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

const closeFastTb_PhieuNCC = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;
    // Prepare data for Tb_PhieuNCC creation

    await tbPhieuNCCService.closeTb_PhieuNCC(ID_PhieuNX);

    res.status(200).json({
      message: "Khóa phiếu thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTb_PhieuNCC = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;
    await tbPhieuNCCService.deleteTb_PhieuNCC(ID_PhieuNX);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTb_PhieuNCC,
  getAllTb_PhieuNCC,
  updateTb_PhieuNCC,
  deleteTb_PhieuNCC,
  getDetailTb_PhieuNCC,
  closeTb_PhieuNCC,
  getPhieuNXByUser,
  closeFastTb_PhieuNCC,
};
