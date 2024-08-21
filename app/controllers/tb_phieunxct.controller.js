const tbPhieuNXCT = require("../services/tb_phieunxct.service");

const scanQrCodeTb_PhieuNXCT = async (req, res) => {
  try {
    const {
      ID_TaisanQrCode,
      ID_PhieuNX,
      ID_Taisan,
      Dongia,
      Soluong,
      Namsx,
    } = req.body;

    const images = req.file;
    const user = req.user.data;

    const reqData = {
      images,
      user,
      Namsx,
      ID_TaisanQrCode,
      ID_PhieuNX,
      ID_Taisan,
      Dongia,
      Soluong,
    };

    await tbPhieuNXCT.scanTb_PhieuNXCT(reqData);
    res.status(200).json({
      message: "Kiểm kê tài sản thành công",
    });
  } catch (error) {
    console.log('err', error)
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scanQrCodeTb_PhieuNXCT,
};
