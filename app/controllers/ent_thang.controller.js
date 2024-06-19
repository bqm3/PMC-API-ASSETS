const entThangService = require("../services/ent_thang.service");

const getAllEnt_thang = async (req, res) => {
  try {
    const data = await entThangService.getAllEnt_thang();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllEnt_thang,
};
