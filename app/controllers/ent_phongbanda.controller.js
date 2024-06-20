const entPhongbandaService = require("../services/ent_phongbanda.service");

const createEnt_phongbanda = async (req, res) => {
  try {
    const { ID_Chinhanh, ID_Nhompb, Mapb, Tenphongban, Diachi, Ghichu, Thuoc } =
      req.body;
    const reqData = {
      ID_Chinhanh: ID_Chinhanh || null,
      ID_Nhompb: ID_Nhompb || null,
      Mapb: Mapb || "",
      Tenphongban: Tenphongban || "",
      Thuoc: Thuoc || "",
      Diachi: Diachi || "",
      Ghichu: Ghichu || "",
      isDelete: 0,
    };
    const data = await entPhongbandaService.createEnt_phongbanda(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetaileEnt_phongbanda = async(req, res) => {
  try {
    const ID_Phongban = req.params.id;
    const data = await entPhongbandaService.getDetailEnt_phongbanda(ID_Phongban);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAlleEnt_phongbanda = async (req, res) => {
  try {
    const data = await entPhongbandaService.getAlleEnt_phongbanda();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateleEnt_phongbanda = async (req, res) => {
  try {
    const { ID_Nhompb,ID_Chinhanh, Mapb, Tenphongban, Diachi, Ghichu, Thuoc } = req.body;
    const ID_Phongban = req.params.id;

    await entPhongbandaService.updateleEnt_phongbanda({
      ID_Phongban: ID_Phongban,
      ID_Chinhanh: ID_Chinhanh || null,
      ID_Nhompb: ID_Nhompb || null,
      Thuoc: Thuoc || "",
      Mapb: Mapb || "",
      Tenphongban: Tenphongban || "",
      Diachi: Diachi || "",
      Ghichu: Ghichu || "",
      isDelete: 0
    });
    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_phongbanda = async (req, res) => {
  try {
    const ID_Phongban = req.params.id;
    await entPhongbandaService.deleteEnt_phongbanda(ID_Phongban);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_phongbanda,
  getDetaileEnt_phongbanda,
  getAlleEnt_phongbanda,
  updateleEnt_phongbanda,
  deleteEnt_phongbanda,
};
