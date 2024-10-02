const entLoainhomService = require("../services/ent_loainhom.service");

const createEnt_Loainhom = async (req, res) => {
  try {
    const { Loainhom } = req.body;
    const reqData = {
      Loainhom: Loainhom,
      isDelete: 0,
    };
    const data = await entLoainhomService.createEnt_Loainhom(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_Loainhom = async (req, res) => {
  try {
    const data = await entLoainhomService.getAllEnt_Loainhom();
    res.status(200).json({
      message: "Danh sách đơn vị",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_Loainhom = async (req, res) => {
  try {
    const userData = req.user.data;
    const { Loainhom } = req.body;

    const ID_Loainhom = req.params.id;
    if (userData) {
      await entLoainhomService.updateEnt_Loainhom({
        ID_Loainhom: ID_Loainhom,
        Loainhom: Loainhom,
      });
      res.status(200).json({
        message: "Cập nhật thành công",
      });
    } else {
      res.status(400).json({
        message: "Cập nhật thất bại",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_Loainhom = async (req, res) => {
  try {
    const ID_Loainhom = req.params.id;
    await entLoainhomService.deleteEnt_Loainhom(ID_Loainhom);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_Loainhom,
  getAllEnt_Loainhom,
  deleteEnt_Loainhom,
  updateEnt_Loainhom,
};
