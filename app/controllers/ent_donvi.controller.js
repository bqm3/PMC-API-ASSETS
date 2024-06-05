const entDonviService = require("../services/ent_donvi.service");

const createEnt_donvi = async (req, res) => {
  try {
    const { Donvi } = req.body;
    const reqData = {
      Donvi: Donvi,
      isDelete: 0,
    };
    const data = await entDonviService.createEnt_donvi(reqData);
    res.status(200).json({
      message: "Tạo đơn vị thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllEnt_donvi = async (req, res) => {
  try {
    const data = await entDonviService.getAlleEnt_donvi();
    res.status(200).json({
      message: "Danh sách đơn vị",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEnt_donvi = async (req, res) => {
  try {
    const { Donvi } = req.body;
    const ID_Donvi = req.params.id;
    await entDonviService.updateleEnt_donvi({
      ID_Donvi: ID_Donvi,
      Donvi: Donvi,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEnt_donvi = async (req, res) => {
  try {
    const ID_Donvi = req.params.id;
    await entDonviService.deleteEnt_donvi(ID_Donvi);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnt_donvi,
  getAllEnt_donvi,
  deleteEnt_donvi,
  updateEnt_donvi
};
