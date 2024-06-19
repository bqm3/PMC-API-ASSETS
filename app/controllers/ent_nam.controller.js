const entNamService = require("../services/ent_nam.service");

const getAllEnt_nam = async (req, res) => {
  try {
    const data = await entNamService.getAllEnt_nam();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllEnt_nam,
};
