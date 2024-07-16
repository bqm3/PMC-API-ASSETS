const tbTaisanQrCodeService = require("../services/tb_taisanqrcode.service");

const createTb_Taisanqrcode = async (req, res) => {
  try {
    const { ID_Taisan, MaQrCode, Ngaykhoitao, iTinhtrang } =
      req.body;
    const reqData = {
      ID_Taisan: ID_Taisan || null,
      MaQrCode: MaQrCode || "",
      Ngaykhoitao: Ngaykhoitao || "",
      iTinhtrang: iTinhtrang || "",
      isDelete: 0,
    };
    const data = await tbTaisanQrCodeService.createTb_taisanqrcode(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailTb_Taisanqrcode = async(req, res) => {
  try {
    const ID_Taisan = req.params.id;
    const data = await tbTaisanQrCodeService.getDetailTb_taisanqrcode(ID_Taisan);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAllTb_Taisanqrcode = async (req, res) => {
  try {
    const data = await tbTaisanQrCodeService.getAllTb_taisanqrcode();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateleTb_Taisanqrcode = async (req, res) => {
  try {
    const { ID_Taisan, MaQrCode, Ngaykhoitao, iTinhtrang } = req.body;
    const ID_TaisanQr  = req.params.id;

    await tbTaisanQrCodeService.updateleTb_taisanqrcode({
      ID_Taisan: ID_Taisan || null,
      MaQrCode: MaQrCode || "",
      Ngaykhoitao: Ngaykhoitao || "",
      iTinhtrang: iTinhtrang || "",
      isDelete: 0,
      ID_TaisanQr: ID_TaisanQr
    });
    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTb_Taisanqrcode = async (req, res) => {
  try {
    const ID_TaisanQr = req.params.id;
    await tbTaisanQrCodeService.deleteTb_taisanqrcode(ID_TaisanQr);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scanQrCodeTb_Taisanqrcode = async(req, res) => {
  try {
    const { Ghichu, iTinhtrang } = req.body;
    const ID_TaisanQr  = req.params.id;
    const images = req.file;
    const user = req.user.data;


    const reqData = {
      Ghichu, iTinhtrang, ID_TaisanQr, images, user
    }

    // console.log(reqData)
    

    await tbTaisanQrCodeService.scanQrCodeTb_Taisanqrcode(reqData);
    res.status(200).json({
      message: "Kiểm kê tài sản thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createTb_Taisanqrcode,
  getDetailTb_Taisanqrcode,
  getAllTb_Taisanqrcode,
  updateleTb_Taisanqrcode,
  deleteTb_Taisanqrcode,
  scanQrCodeTb_Taisanqrcode
};
