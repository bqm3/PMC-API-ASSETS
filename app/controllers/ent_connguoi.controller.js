const entConnguoiService = require("../services/ent_connguoi.service");

const createEnt_connguoi = async (req, res) => {
  try {
    const user = req.user.data;
    const { MaPMC, Hoten, Gioitinh, Diachi, Sodienthoai, Ghichu, NgayGhinhan } =
      req.body;
    const reqData = {
      user: user,
      MaPMC: MaPMC,
      Hoten: Hoten,
      Gioitinh: Gioitinh,
      Diachi: Diachi,
      Sodienthoai: Sodienthoai,
      Ghichu: Ghichu,
      NgayGhinhan: NgayGhinhan,
    };
    const data = await entConnguoiService.createEnt_connguoi(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailEnt_connguoi = async (req, res) => {
  try {
    const user = req.user.data;
    const ID_Connguoi = req.params.id;

    const resData = {
      user: user,
      ID_Connguoi: ID_Connguoi,
    };
    const data = await entConnguoiService.getDetailEnt_connguoi(resData);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_connguoi = async (req, res) => {
  try {
    const user = req.user.data;
    const ID_Connguoi = req.params.id;
    const { MaPMC, Hoten, Gioitinh, Diachi, Sodienthoai, Ghichu, NgayGhinhan } =
      req.body;
    const reqData = {
      ID_Connguoi: ID_Connguoi,
      user: user,
      MaPMC: MaPMC,
      Hoten: Hoten,
      Gioitinh: Gioitinh,
      Diachi: Diachi,
      Sodienthoai: Sodienthoai,
      Ghichu: Ghichu,
      NgayGhinhan: NgayGhinhan,
    };
    const data = await entConnguoiService.updateEnt_connguoi(reqData);
    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_connguoi = async (req, res) => {
  try {
    const user = req.user.data;
    const data = await entConnguoiService.getAllEnt_connguoi(user);
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_connguoi = async (req, res) => {
  try {
    const user = req.user.data;
    const ID_Connguoi = req.params.id;
    const data = {
      user: user,
      ID_Connguoi: ID_Connguoi,
    };
    await entConnguoiService.deleteEnt_connguoi(data);
    res.status(200).json({
      message: "Xóa nhân viên thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_connguoi,
  updateEnt_connguoi,
  getAllEnt_connguoi,
  deleteEnt_connguoi,
  getDetailEnt_connguoi,
};
