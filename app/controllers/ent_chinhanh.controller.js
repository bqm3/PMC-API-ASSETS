const entChinhanhService = require("../services/ent_chinhanh.service");

const createEnt_chinhanh = async (req, res) => {
  try {
    const { Donvi } = req.body;
    const reqData = {
      Donvi: Donvi,
      isDelete: 0,
    };
    const data = await entChinhanhService.createEnt_chinhanh(reqData);
    res.status(200).json({
      message: "Tạo đơn vị thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_chinhanh = async (req, res) => {
  try {
    const data = await entChinhanhService.getAllEnt_chinhanh();
    res.status(200).json({
      message: "Danh sách đơn vị",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_chinhanh = async (req, res) => {
  try {
    const { Tenchinhanh } = req.body;
    const ID_Chinhanh = req.params.id;
    await entChinhanhService.updateEnt_chinhanh({
      ID_Chinhanh: ID_Chinhanh,
      Tenchinhanh: Tenchinhanh,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_chinhanh = async (req, res) => {
  try {
    const ID_Chinhanh = req.params.id;
    await entChinhanhService.deleteEnt_chinhanh(ID_Chinhanh);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_chinhanh,
  getAllEnt_chinhanh,
  deleteEnt_chinhanh,
  updateEnt_chinhanh
};
