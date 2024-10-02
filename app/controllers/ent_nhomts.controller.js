const entNhomtsService = require("../services/ent_nhomts.service");

const createEnt_nhomts = async (req, res) => {
  try {
    const { Manhom, Tennhom, ID_Loainhom,Ghichu } = req.body;
    const reqData = {
      Manhom: Manhom,
      Tennhom: Tennhom,
      ID_Loainhom: ID_Loainhom,
      Ghichu: Ghichu,
      isDelete: 0,
    };

    const data = await entNhomtsService.createEnt_nhomts(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_nhomts = async (req, res) => {
  try {
    const data = await entNhomtsService.getAllEnt_nhomts();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_nhomts = async (req, res) => {
  try {
    const { Manhom, Tennhom, ID_Loainhom } = req.body;
    const ID_Nhomts = req.params.id;
    await entNhomtsService.updateEnt_nhomts({
      ID_Nhomts: ID_Nhomts,
      Manhom: Manhom,
      Tennhom: Tennhom,
      ID_Loainhom: ID_Loainhom,
    });
    res.status(200).json({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_nhomts = async (req, res) => {
  try {
    const ID_Nhomts = req.params.id;
    await entNhomtsService.deleteEnt_nhomts(ID_Nhomts);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_nhomts,
  getAllEnt_nhomts,
  updateEnt_nhomts,
  deleteEnt_nhomts
};
