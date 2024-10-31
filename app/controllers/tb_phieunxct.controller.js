const Ent_Taisan = require("../models/ent_taisan.model");
const Tb_PhieuNX = require("../models/tb_phieunx.model");
const Tb_PhieuNXCT = require("../models/tb_phieunxct.model");
const Tb_TaisanQrCode = require("../models/tb_taisanqrcode.model");
const Tb_Tonkho = require("../models/tb_tonkho.model");
const tbPhieuNXCT = require("../services/tb_phieunxct.service");

const scanQrCodeTb_PhieuNXCT = async (req, res) => {
  try {
    const {
      ID_TaisanQrcode,
      ID_PhieuNX,
      ID_Taisan,
      Dongia,
      Soluong,
      Namsx,
      ID_Phongban,
      ID_Nam,
      ID_Quy,
      MaQrCode,
    } = req.body;

    const images = req.file;
    const user = req.user.data;

    const reqData = {
      images,
      user,
      Namsx,
      ID_TaisanQrcode,
      ID_PhieuNX,
      ID_Taisan,
      Dongia,
      Soluong,
      ID_Phongban,
      ID_Nam,
      ID_Quy,
      MaQrCode,
    };

    await tbPhieuNXCT.scanTb_PhieuNXCT(reqData);
    res.status(200).json({
      message: "Kiểm kê tài sản thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  scanQrCodeTb_PhieuNXCT
};
