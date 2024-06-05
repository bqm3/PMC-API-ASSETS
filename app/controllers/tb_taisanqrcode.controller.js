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
    res.status(500).json({ error: error.message });
  }
};

const getDetaileTb_Taisanqrcode = async(req, res) => {
  try {
    const ID_Taisan = req.params.id;
    const data = await tbTaisanQrCodeService.getDetailTb_taisanqrcode(ID_Taisan);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAlleTb_Taisanqrcode = async (req, res) => {
  try {
    const data = await tbTaisanQrCodeService.getAlleTb_taisanqrcode();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateleTb_Taisanqrcode = async (req, res) => {
  try {
    const { ID_Taisan, MaQrCode, Ngaykhoitao, iTinhtrang } = req.body;
    const ID_TaisanQrCode  = req.params.id;

    await tbTaisanQrCodeService.updateleTb_taisanqrcode({
      ID_Taisan: ID_Taisan || null,
      MaQrCode: MaQrCode || "",
      Ngaykhoitao: Ngaykhoitao || "",
      iTinhtrang: iTinhtrang || "",
      isDelete: 0,
      ID_TaisanQrCode: ID_TaisanQrCode
    });
    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTb_Taisanqrcode = async (req, res) => {
  try {
    const ID_TaisanQrCode = req.params.id;
    await tbTaisanQrCodeService.deleteTb_taisanqrcode(ID_TaisanQrCode);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTb_Taisanqrcode,
  getDetaileTb_Taisanqrcode,
  getAlleTb_Taisanqrcode,
  updateleTb_Taisanqrcode,
  deleteTb_Taisanqrcode,
};
