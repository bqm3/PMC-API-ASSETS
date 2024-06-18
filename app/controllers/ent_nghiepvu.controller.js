const entNghiepvuService = require("../services/ent_nghiepvu.service");

const createEnt_nghiepvu = async (req, res) => {
  try {
    const { Nghiepvu } = req.body;
    const reqData = {
      Nghiepvu: Nghiepvu,
      isDelete: 0,
    };
    const data = await entNghiepvuService.createEnt_nghiepvu(reqData);
    res.status(200).json({
      message: "Tạo nghiệp vụ thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_nghiepvu = async (req, res) => {
  try {
    const data = await entNghiepvuService.getAlleEnt_nghiepvu();
    res.status(200).json({
      message: "Danh sách nghiệp vụ",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_nghiepvu = async (req, res) => {
  try {
    const { Nghiepvu } = req.body;
    const ID_Nghiepvu = req.params.id;
    await entNghiepvuService.updateleEnt_nghiepvu({
      ID_Nghiepvu: ID_Nghiepvu,
      Nghiepvu: Nghiepvu,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_nghiepvu = async (req, res) => {
  try {
    const ID_Nghiepvu = req.params.id;
    await entNghiepvuService.deleteEnt_nghiepvu(ID_Nghiepvu);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_nghiepvu,
  getAllEnt_nghiepvu,
  deleteEnt_nghiepvu,
  updateEnt_nghiepvu
};
