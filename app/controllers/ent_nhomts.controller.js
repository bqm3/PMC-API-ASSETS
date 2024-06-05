const entNhomtsService = require("../services/ent_nhomts.service");

const createEnt_nhomts = async (req, res) => {
  try {
    const { Manhom, Loaits } = req.body;
    const reqData = {
      Manhom: Manhom,
      Loaits: Loaits,
      isDelete: 0,
    };
    const data = await entNhomtsService.createEnt_nhomts(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAlleEnt_nhomts = async (req, res) => {
  try {
    const data = await entNhomtsService.getAlleEnt_nhomts();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateleEnt_nhomts = async (req, res) => {
  try {
    const { Manhom, Loaits } = req.body;
    const ID_Loaits = req.params.id;
    await entNhomtsService.updateleEnt_nhomts({
      ID_Loaits: ID_Loaits,
      Manhom: Manhom,
      Loaits: Loaits,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEnt_nhomts = async (req, res) => {
  try {
    const ID_Loaits = req.params.id;
    await entNhomtsService.deleteEnt_nhomts(ID_Loaits);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnt_nhomts,
  getAlleEnt_nhomts,
  updateleEnt_nhomts,
  deleteEnt_nhomts
};
