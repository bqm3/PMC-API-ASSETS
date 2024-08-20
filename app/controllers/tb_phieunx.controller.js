const tbPhieuNXService = require("../services/tb_phieunx.service");
const tbPhieuNXCTService = require("../services/tb_phieunxct.service");
const tbTaiSanQrService = require("../services/tb_taisanqrcode.service");
const eThangService = require("../services/ent_thang.service");
const eNamService = require("../services/ent_nam.service");

const createTb_PhieuNX = async (req, res) => {
  try {
    const user = req.user.data;
    const {
      ID_Nghiepvu,
      Sophieu,
      ID_NoiNhap,
      ID_NoiXuat,
      NgayNX,
      Ghichu,
      ID_Quy,
      phieunxct,
    } = req.body;

    // if (!Array.isArray(phieunxct) || phieunxct.length === 0) {
    //   return res.status(400).json({
    //     message: "Danh sách chi tiết phiếu nhập xuất không được trống.",
    //   });
    // }

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNX creation
    const reqData = {
      ID_Nghiepvu: ID_Nghiepvu,
      Sophieu: Sophieu,
      ID_NoiNhap: ID_NoiNhap,
      ID_NoiXuat: ID_NoiXuat,
      ID_Nam: Nam.ID_Nam,
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      ID_Quy: ID_Quy,
      iTinhtrang: 0,
      isDelete: 0,
    };

    let data;

    // Create Tb_PhieuNX
    data = await tbPhieuNXService.createTb_PhieuNX(reqData);

    // Create Tb_PhieuNXCT
    if(phieunxct[0].ID_Taisan !==  null){
      await tbPhieuNXCTService.createTb_PhieuNXCT(phieunxct, data);
    }

    // Send success response
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    // Handle errors
    console.error("Error in creating Tb_PhieuNX:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo phiếu nhập xuất" });
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

    console.log('userData',userData)
    console.log('ID_Quy',ID_Quy)

    const data = await tbPhieuNXService.getPhieuNXByUser(userData.ID_User, ID_Quy);
    res.status(200).json({
      message: "Danh sách phiếu kiểm kê của nhân viên trong quý",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateTb_PhieuNX = async (req, res) => {
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

    // if (!Array.isArray(phieunxct) || phieunxct.length === 0) {
    //   return res.status(400).json({
    //     message: "Danh sách chi tiết phiếu nhập xuất không được trống.",
    //   });
    // }

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
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      ID_Quy: ID_Quy,
      isDelete: 0,
    };

    let data;

    // Update Tb_PhieuNX
    data = await tbPhieuNXService.updateTb_PhieuNX(reqData);
    // Update Tb_PhieuNXCT
    if(phieunxct[0].ID_Taisan !==  null){
      await tbPhieuNXCTService.updateTb_PhieuNXCT(phieunxct, data);
    }

    // Send success response
    res.status(200).json({
      message: "Cập nhật thành công",
      data: data,
    });
  } catch (error) {
    // Handle errors
    console.error("Error in creating Tb_PhieuNX:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo phiếu nhập xuất" });
  }
};

const closeTb_PhieuNX = async (req, res) => {
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
    } = req.body;

    // if (!Array.isArray(phieunxct) || phieunxct.length === 0) {
    //   return res.status(400).json({
    //     message: "Danh sách chi tiết phiếu nhập xuất không được trống.",
    //   });
    // }

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
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      isDelete: 0,
    };

    await tbPhieuNXService.closeTb_PhieuNX(ID_PhieuNX);
     // Insert data to Ent_QRCode if ID_Nghiepvu is 1 or 2
   
     if ((ID_Nghiepvu == 1 || ID_Nghiepvu == 2) && phieunxct[0].ID_Taisan !==  null) {
      await tbTaiSanQrService.insertDataToEntQRCode(phieunxct, reqData);
    }

    res.status(200).json({
      message: "Đóng thành công!",
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
  getPhieuNXByUser
};
