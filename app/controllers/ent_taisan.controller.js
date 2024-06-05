const entTaisanService = require("../services/ent_taisan.service");

const createEnt_taisan = async (req, res) => {
  try {
    const { ID_Nhomts, ID_Donvi, Mats, Tents, Thongso, Ghichu } =
      req.body;
    const reqData = {
      ID_Nhomts: ID_Nhomts || null,
      ID_Donvi: ID_Donvi || null,
      Mats: Mats || "",
      Tents: Tents || "",
      Thongso: Thongso || "",
      Ghichu: Ghichu || "",
      isDelete: 0,
    };
    const data = await entTaisanService.createEnt_taisan(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDetaileEnt_taisan = async(req, res) => {
  try {
    const ID_Taisan = req.params.id;
    const data = await entTaisanService.getDetailEnt_taisan(ID_Taisan);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAlleEnt_taisan = async (req, res) => {
  try {
    const data = await entTaisanService.getAlleEnt_taisan();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateleEnt_taisan = async (req, res) => {
  try {
    const { ID_Nhomts, ID_Donvi, Mats, Tents, Thongso, Ghichu } = req.body;
    const ID_Taisan  = req.params.id;

    await entTaisanService.updateleEnt_taisan({
      ID_Nhomts: ID_Nhomts || null,
      ID_Donvi: ID_Donvi || null,
      Mats: Mats || "",
      Tents: Tents || "",
      Thongso: Thongso || "",
      Ghichu: Ghichu || "",
      ID_Taisan: ID_Taisan
    });
    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEnt_taisan = async (req, res) => {
  try {
    const ID_Taisan = req.params.id;
    await entTaisanService.deleteEnt_taisan(ID_Taisan);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnt_taisan,
  getDetaileEnt_taisan,
  getAlleEnt_taisan,
  updateleEnt_taisan,
  deleteEnt_taisan,
};
