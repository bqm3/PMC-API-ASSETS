const entNhompb = require("../services/ent_nhompb.service");

const createEnt_nhompb = async (req, res) => {
  try {
    const { Nhompb } = req.body;
    const reqData = {
      Nhompb: Nhompb,
      isDelete: 0,
    };
    const data = await entNhompb.createEnt_nhompb(reqData);
    console.log('data',data)
    res.status(200).json({
      message: "Tạo nhóm phòng ban thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnt_nhompb,
};
