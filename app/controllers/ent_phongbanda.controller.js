const entPhongbandaService = require("../services/ent_phongbanda.service");

const createEnt_phongbanda = async (req, res) => {
  try {
    const { ID_Chinhanh, ID_Nhompb, Mapb, Tenphongban, Diachi, Ghichu, Thuoc } = req.body;

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

    const roomExists = await entPhongbandaService.check_phongbanda(Mapb, Tenphongban);
    if (roomExists) {
      return res.status(400).json({
        message: "Mã phòng ban hoặc tên phòng ban đã tồn tại. Vui lòng nhập lại thông tin.",
      });
    }

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

const getAllEnt_phongbanda = async (req, res) => {
  try {
    const data = await entPhongbandaService.getAllEnt_phongbanda();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_phongbanda = async (req, res) => {
  try {
    const { ID_Nhompb,ID_Chinhanh, Mapb, Tenphongban, Diachi, Ghichu, Thuoc } = req.body;
    const ID_Phongban = req.params.id;

    const roomExists = await entPhongbandaService.check_phongbanda(Mapb, Tenphongban, ID_Phongban);
    if (roomExists) {
      return res.status(400).json({
        message: "Mã phòng ban hoặc tên phòng ban đã tồn tại. Vui lòng nhập lại thông tin.",
      });
    }

    await entPhongbandaService.updateEnt_phongbanda({
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
  getAllEnt_phongbanda,
  updateEnt_phongbanda,
  deleteEnt_phongbanda,
};
