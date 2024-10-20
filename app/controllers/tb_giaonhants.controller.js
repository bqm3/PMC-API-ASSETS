const sequelize = require("../config/db.config");
const tbGiaonhanTSCT = require("../services/tb_giaonhantsct.service");

const createGiaoNhanTS = async (req, res) => {
  try {
    const user = req.user.data;
    const {
      iGiaonhan,
      Nguoinhan,
      Ngay,
      Ghichu,
      Nguoigiao,
      giaonhantsct,
      ID_Quy,
      ID_Nam,
    } = req.body;

    if (!iGiaonhan || !Nguoinhan || !Ngay || !Nguoigiao) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin phiếu",
      });
    }

    const reqData = {
      ID_Phongban: user.ID_Phongban,
      iGiaonhan: iGiaonhan,
      Nguoinhan: Nguoinhan,
      Ngay: Ngay,
      Ghichu: Ghichu || "",
      Nguoigiao: Nguoigiao,
      ID_Quy: ID_Quy,
      ID_Nam: ID_Nam,
      isDelete: 0,
    };

    await tbGiaonhanTSCT.create_Tb_GiaoNhanTS(giaonhantsct, reqData);

    res.status(200).json({
      message: "Tạo phiếu giao nhận tài sản thành công",
      // data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi tạo phiếu giao nhận tài sản",
    });
  }
};

const updateGiaoNhanTS = async (req, res) => {
  try {
    const ID_Giaonhan = req.params.id;
    const { giaonhantsct } = req.body;
    await tbGiaonhanTSCT.update_Tb_GiaoNhanTS(ID_Giaonhan, giaonhantsct);
    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi cập nhật",
    });
  }
};

const getDetailGiaoNhanTS = async (req, res) => {
  try {
    const ID_Giaonhan = req.params.id;
    const data = await tbGiaonhanTSCT.getDetail_Tb_GiaoNhanTS(ID_Giaonhan);
    return res.status(200).json({
      message: "Lấy thông tin giao nhận tài sản thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy thông tin giao nhận tài sản",
      error: error.message,
    });
  }
};

const deleteGiaoNhanTS = async (req, res) => {
  try {
    const ID_Giaonhan = req.params.id;
    const result = await tbGiaonhanTSCT.delete_Tb_GiaonhanTS(ID_Giaonhan);

    return res.status(200).json({
      message: "Xóa thông tin giao nhận tài sản thành công",
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Có lỗi xảy ra khi xóa giao nhận tài sản",
      error: error.message,
    });
  }
};

const getAllGiaoNhanTS = async (req, res) => {
  try {
    const data = await tbGiaonhanTSCT.getAll_Tb_GiaonhanTS(); // Gọi hàm lấy dữ liệu
    return res.status(200).json({
      message: "Lấy danh sách giao nhận tài sản thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách giao nhận tài sản",
      error: error.message,
    });
  }
};

const filterGiaoNhanTS = async (req, res) => {
  try {
    const {ID_Phongban, ID_Quy, ID_Nam} = req.body;
    const resData = {
      ID_Phongban, ID_Nam, ID_Quy
    }

    const data = await tbGiaonhanTSCT.filter_Tb_GiaonhanTS(resData); // Gọi hàm lấy dữ liệu
    return res.status(200).json({
      message: "Lấy danh sách giao nhận tài sản thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách giao nhận tài sản",
      error: error.message,
    });
  }
}

const getByIDPBanGiaoNhanTS = async (req, res) => {
  try {
    const ID_Phongban = req.params.id;
    const data = await tbGiaonhanTSCT.getBy_IDPhongban_GiaonhanTS(ID_Phongban);
    return res.status(200).json({
      message: "Lấy danh sách giao nhận tài sản thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách giao nhận tài sản",
      error: error.message,
    });
  }
};

module.exports = {
  createGiaoNhanTS,
  updateGiaoNhanTS,
  getDetailGiaoNhanTS,
  deleteGiaoNhanTS,
  getAllGiaoNhanTS,
  getByIDPBanGiaoNhanTS,
  filterGiaoNhanTS
};
