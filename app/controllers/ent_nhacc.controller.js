const entNhaccService = require("../services/ent_nhacc.service");
const { Ent_Nhacc } = require("../models/setup.model");
const { removeVietnameseTones } = require("../utils/utils");

const createEnt_Nhacc = async (req, res) => {
  try {
    const {
      MaNhacc,
      TenNhacc,
      Masothue,
      Thanhpho,
      Sodienthoai,
      Sotaikhoan,
      Nganhang,
      Nguoilienhe,
      Email,
      Diachi,
      Ghichu,
    } = req.body;
    const reqData = {
      MaNhacc: MaNhacc,
      TenNhacc: TenNhacc,
      Thanhpho: Thanhpho,
      Masothue: Masothue,
      Sodienthoai: Sodienthoai,
      Sotaikhoan: Sotaikhoan,
      Nganhang: Nganhang,
      Nguoilienhe: Nguoilienhe,
      Email: Email,
      Diachi: Diachi,
      Ghichu: Ghichu,
      isDelete: 0,
    };

    const dataDetail = await entNhaccService.getDetail({
      MaNhacc: MaNhacc,
      TenNhacc: TenNhacc,
      Masothue: Masothue,
    });
    if (dataDetail) {
      let conflictDetails = [];
      if (removeVietnameseTones(dataDetail.MaNhacc) == removeVietnameseTones(MaNhacc)){
        conflictDetails.push(`mã nhà cung cấp: ${MaNhacc}`);
      }
      if (removeVietnameseTones(dataDetail.TenNhacc) == removeVietnameseTones(TenNhacc)){
        conflictDetails.push(`tên nhà cung cấp: ${TenNhacc}`);
      }
      if (removeVietnameseTones(dataDetail.Masothue) == removeVietnameseTones(Masothue)){
        conflictDetails.push(`mã số thuế: ${Masothue}`);
      }
      res
        .status(409)
        .json({
          message: `Nhà cung cấp đã tồn tại với ${conflictDetails.join(
            ", "
          )}. Vui lòng kiểm tra lại.`,
        });
    } else {
      const data = await entNhaccService.create(reqData);
      res.status(200).json({
        message: "Tạo thành công",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_Nhacc = async (req, res) => {
  try {
    const data = await entNhaccService.getAll();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailEnt_Nhacc = async (req, res) => {
  try {
    const ID_Nhacc = req.params.id;
    const data = await Ent_Nhacc.findByPk(ID_Nhacc, {
      attributes: [
        "ID_Nhacc",
        "MaNhacc",
        "TenNhacc",
        "Masothue",
        "Thanhpho",
        "Sodienthoai",
        "Sotaikhoan",
        "Nganhang",
        "Nguoilienhe",
        "Email",
        "Diachi",
        "Ghichu",
        "isDelete",
      ],
      where: {
        isDelete: 0,
      },
    });
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_Nhacc = async (req, res) => {
  try {
    const ID_Nhacc = req.params.id;

    const {
      MaNhacc,
      TenNhacc,
      Masothue,
      Sodienthoai,
      Sotaikhoan,
      Nganhang,
      Nguoilienhe,
      Email,
      Thanhpho,
      Diachi,
      Ghichu,
    } = req.body;

    const reqData = {
      ID_Nhacc: ID_Nhacc,
      MaNhacc: MaNhacc,
      TenNhacc: TenNhacc,
      Masothue: Masothue,
      Sodienthoai: Sodienthoai,
      Sotaikhoan: Sotaikhoan,
      Nganhang: Nganhang,
      Nguoilienhe: Nguoilienhe,
      Email: Email,
      Thanhpho: Thanhpho,
      Diachi: Diachi,
      Ghichu: Ghichu,
      isDelete: 0,
    };

    if (ID_Nhacc <= 5) {
      return res.status(400).json({
        message: "Không thể thay đổi nhà cung cấp",
      });
    }

    const dataDetail = await entNhaccService.getDetailByID({
      ID_Nhacc: ID_Nhacc,
      MaNhacc: MaNhacc,
      TenNhacc: TenNhacc,
      Masothue: Masothue,
    });

    if (dataDetail) {
      let conflictDetails = [];
      if (removeVietnameseTones(dataDetail.MaNhacc) == removeVietnameseTones(MaNhacc)){
        conflictDetails.push(`mã nhà cung cấp: ${MaNhacc}`);
      }
      if (removeVietnameseTones(dataDetail.TenNhacc) == removeVietnameseTones(TenNhacc)){
        conflictDetails.push(`tên nhà cung cấp: ${TenNhacc}`);
      }
      if (removeVietnameseTones(dataDetail.Masothue) == removeVietnameseTones(Masothue)){
        conflictDetails.push(`mã số thuế: ${Masothue}`);
      }
      res
        .status(409)
        .json({
          message: `Nhà cung cấp đã tồn tại với ${conflictDetails.join(
            ", "
          )}. Vui lòng kiểm tra lại.`,
        });
    } else {
      const data = await entNhaccService.update(reqData);
      return res.status(200).json({
        message: "Cập nhật thành công",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteEnt_Nhacc = async (req, res) => {
  try {
    const ID_Nhacc = req.params.id;

    if (ID_Nhacc <= 5) {
      return res.status(400).json({
        message: "Không xóa nhà cung cấp",
      });
    }
    await entNhaccService.deleteNhaCC(ID_Nhacc);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_Nhacc,
  getAllEnt_Nhacc,
  updateEnt_Nhacc,
  deleteEnt_Nhacc,
  getDetailEnt_Nhacc,
};
