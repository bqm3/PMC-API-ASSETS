const entNhompbService = require("../services/ent_nhompb.service");

const createEnt_nhompb = async (req, res) => {
  try {
    const { Nhompb } = req.body;
    const reqData = {
      Nhompb: Nhompb,
      isDelete: 0,
    };
    const data = await entNhompbService.createEnt_nhompb(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAlleEnt_nhompb = async (req, res) => {
  try {
    const data = await entNhompbService.getAlleEnt_nhompb();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateleEnt_nhompb = async (req, res) => {
  try {
    const { Nhompb } = req.body;
    const ID_Nhompb = req.params.id;
    await entNhompbService.updateleEnt_nhompb({
      ID_Nhompb: ID_Nhompb,
      Nhompb: Nhompb,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEnt_nhompb = async (req, res) => {
  try {
    const ID_Nhompb = req.params.id;
    await entNhompbService.deleteEnt_nhompb(ID_Nhompb);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnt_nhompb,
  getAlleEnt_nhompb,
  updateleEnt_nhompb,
  deleteEnt_nhompb
};
