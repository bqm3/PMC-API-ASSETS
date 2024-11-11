const entHangService = require("../services/ent_hang.service");

const createEnt_hang = async (req, res) => {
  try {
    const { Tenhang } = req.body;
    const reqData = {
      Tenhang: Tenhang,
      isDelete: 0,
    };
    const data = await entHangService.createEnt_Hang(reqData);
    res.status(200).json({
      message: "Thêm hãng thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_hang = async (req, res) => {
  try {
    const data = await entHangService.getAllEnt_Hang();
    res.status(200).json({
      message: "Danh sách hãng",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_hang = async (req, res) => {
  try {
    const { Tenhang } = req.body;
    const ID_Hang = req.params.id;
    await entHangService.updateEnt_Hang({
      ID_Hang: ID_Hang,
      Tenhang: Tenhang,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_hang = async (req, res) => {
  try {
    const ID_Hang = req.params.id;
    await entHangService.deleteEnt_Hang(ID_Hang);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_hang,
  getAllEnt_hang,
  deleteEnt_hang,
  updateEnt_hang
};
