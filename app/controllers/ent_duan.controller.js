const entDuanService = require("../services/ent_duan.service");

const createEnt_duan = async (req, res) => {
  try {
    const { Duan } = req.body;
    const reqData = {
      Duan: Duan,
      isDelete: 0,
    };
    const data = await entDuanService.createEnt_Duan(reqData);
    res.status(200).json({
      message: "Tạo dự án thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_duan = async (req, res) => {
  try {
    const data = await entDuanService.getAllEnt_Duan();
    res.status(200).json({
      message: "Danh sách dự án",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_duan = async (req, res) => {
  try {
    const { Duan } = req.body;
    const ID_Duan = req.params.id;
    await entDuanService.updateEnt_Duan({
      ID_Duan: ID_Duan,
      Duan: Duan,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_duan = async (req, res) => {
  try {
    const ID_Duan = req.params.id;
    await entDuanService.deleteEnt_Duan(ID_Duan);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createEnt_duan,
  getAllEnt_duan,
  deleteEnt_duan,
  updateEnt_duan
};
