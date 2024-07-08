const entChucvuService = require("../services/ent_chucvu.service");


const getAllEnt_chucvu = async (req, res) => {
  try {
    const data = await entChucvuService.getAllEnt_chucvu();
    res.status(200).json({
      message: "Danh sách đơn vị",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEnt_chucvu
};
