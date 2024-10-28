const tbPhieuNCCService = require("../services/tb_phieuncc.service");
const tbPhieuNCCCTService = require("../services/tb_phieunccct.service");
const tbTaiSanQrService = require("../services/tb_taisanqrcode.service");
const eThangService = require("../services/ent_thang.service");
const eNamService = require("../services/ent_nam.service");
const Tb_PhieuNCC = require("../models/tb_phieuncc.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");
const Ent_Nghiepvu = require("../models/ent_nghiepvu.model");
const Ent_Phongbanda = require("../models/ent_phongbanda.model");
const Ent_Nhacc = require("../models/ent_nhacc.model");
const Ent_User = require("../models/ent_user.model");
const Ent_Nhompb = require("../models/ent_nhompb.model");
const Tb_PhieuNCCCT = require("../models/tb_phieunccct.model");

const createTb_PhieuNCC = async (req, res) => {
  try {
    const user = req.user.data;
    const {
      ID_Nghiepvu,
      Sophieu,
      ID_Loainhom,
      ID_NoiNhap,
      ID_NoiXuat,
      NgayNX,
      Ghichu,
      ID_Quy,
      phieunccct,
    } = req.body;

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNCC creation
    const reqData = {
      ID_Nghiepvu: ID_Nghiepvu,
      Sophieu: Sophieu,
      ID_Phieu1:
        ID_Nghiepvu == 5 || ID_Nghiepvu == 6 || ID_Nghiepvu == 7
          ? ID_NoiXuat
          : ID_NoiNhap,
      ID_Phieu2:
        ID_Nghiepvu == 5 || ID_Nghiepvu == 6 || ID_Nghiepvu == 7
          ? ID_NoiNhap
          : ID_NoiXuat,
      ID_Loainhom: ID_Loainhom,
      ID_Nam: Nam.ID_Nam,
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      ID_Quy: ID_Quy,
      iTinhtrang: 0,
      isDelete: 0,
      ID_Phongban: user.ID_Phongban,
    };

    let data;
    const filteredArray = phieunccct.filter((item) => item.isDelete === 0);
    data = await tbPhieuNCCService.createTb_PhieuNCC(filteredArray, reqData);
    // Send success response
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi tạo phiếu nhập xuất",
    });
  }
};

const getDetailTb_PhieuNCC = async (req, res) => {
  try {
    const ID_PhieuNCC = req.params.id;

    const data = await tbPhieuNCCService.getDetailTb_PhieuNCC(ID_PhieuNCC);
    res.status(200).json({
      message: "Dữ liệu 1",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTb_PhieuNCC = async (req, res) => {
  try {
    const data = await tbPhieuNCCService.getAllTb_PhieuNCC();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPhieuNCCByUser = async (req, res) => {
  try {
    const userData = req.user.data;
    const ID_Quy = req.params.id;

    const data = await tbPhieuNCCService.getPhieuNCCByUser(
      userData.ID_User,
      ID_Quy
    );
    res.status(200).json({
      message: "Danh sách phiếu kiểm kê của nhân viên trong quý",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPhieuNCCFilter = async (req, res) => {
  const { ID_Nghiepvu, ID_NoiXuat, ID_Loainhom, ID_Quy, NgayNX } = req.body;
  const Nam = await eNamService.getDetail(NgayNX);
  const resData = await Tb_PhieuNCC.findAll({
    attributes: [
      "ID_PhieuNCC",
      "ID_Nghiepvu",
      "Sophieu",
      "ID_Phieu1",
      "ID_Phieu2",
      "ID_Loainhom",
      "ID_User",
      "NgayNX",
      "Ghichu",
      "ID_Nam",
      "ID_Thang",
      "ID_Quy",
      "iTinhtrang",
      "isDelete",
      "ID_Phongban",
    ],
    include: [
      {
        model: Ent_Nghiepvu,
        attributes: ["ID_Nghiepvu", "Nghiepvu", "isDelete"],
        where: {
          isDelete: 0,
        },
      },
      {
        model: Ent_Phongbanda,
        as: "ent_phongbanda",
        attributes: [
          "ID_Phongban",
          "ID_Chinhanh",
          "ID_Nhompb",
          "Mapb",
          "Tenphongban",
          "Diachi",
          "Ghichu",
          "isDelete",
        ],
      },
      {
        model: Ent_Nhacc,
        as: "ent_nhacc",
        attributes: ["ID_Nhacc", "MaNhacc", "TenNhacc", "Masothue"],
      },
      {
        model: Ent_User,
        attributes: [
          "ID_User",
          "ID_Nhompb",
          "ID_Chinhanh",
          "MaPMC",
          "Hoten",
          "Gioitinh",
          "Diachi",
          "Sodienthoai",
          "Emails",
          "Anh",
          "isDelete",
          "ID_Chucvu",
          "ID_Phongban",
        ],
        include: [
          {
            model: Ent_Nhompb,
            attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
            where: {
              isDelete: 0,
            },
          },
          {
            model: Ent_Phongbanda,
            as: "ent_phongbanda",
            attributes: ["ID_Phongban", "TenPhongban"],
          },
        ],
      },
    ],
    where: {
      isDelete: 0,
      ID_Phieu1: ID_NoiXuat,
      ID_Loainhom: ID_Loainhom,
      ID_Quy: ID_Quy,
      ID_Nam: Nam.ID_Nam,
    },
    order: [["NgayNX", "DESC"]],
  });
  const arrayOfIDs = resData.map((item) => item.ID_PhieuNCC);
  const resPhieuNCCCT = await Tb_PhieuNCCCT.findAll({
    where: {
      ID_PhieuNCC: arrayOfIDs,
    },
    attributes: [
      "ID_PhieuNCCCT",
      "ID_PhieuNCC",
      "ID_Taisan",
      "Soluong",
      "Dongia",
      "Namsx",
      "isDelete",
    ],
  });

  return res.status(200).json({
    message: "Thành công",
    data: resData,
    phieunccct: resPhieuNCCCT,
  });
};

const updateTb_PhieuNCC = async (req, res) => {
  const t = await sequelize.transaction(); // Bắt đầu transaction
  try {
    const user = req.user.data;
    const ID_PhieuNCC = req.params.id;

    const {
      ID_Nghiepvu,
      Sophieu,
      ID_NoiNhap,
      ID_NoiXuat,
      ID_Loainhom,
      NgayNX,
      Ghichu,
      phieunccct,
      ID_Quy,
    } = req.body;

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNCC update
    const reqData = {
      ID_PhieuNCC,
      ID_Nghiepvu,
      Sophieu,
      ID_Phieu1: ID_NoiNhap,
      ID_Phieu2: ID_NoiXuat,
      ID_Nam: Nam.ID_Nam,
      ID_Loainhom,
      ID_Thang: Thang.ID_Thang,
      NgayNX,
      ID_User: user.ID_User,
      Ghichu,
      ID_Quy,
      isDelete: 0,
      ID_Phongban: user.ID_Phongban,
    };

    const updatePhieuNXResult = await tbPhieuNCCService.updateTb_PhieuNCC(
      reqData,
      { transaction: t }
    );

    if (!updatePhieuNXResult) {
      await t.rollback(); // Rollback nếu có lỗi
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi cập nhật phiếu nhập xuất" });
    }

    if (
      Array.isArray(phieunccct) &&
      phieunccct.length > 0 &&
      phieunccct[0].ID_Taisan !== null
    ) {
      const checkphieunccct = phieunccct.filter((item) => item.isUpdate === 1);
      const items = checkphieunccct.filter(
        (item) =>
          !(
            item.ID_PhieuNCCCT === null ||
            (item.ID_PhieuNCCCT === undefined && item.isDelete === 1)
          )
      );
      switch (Number(ID_Nghiepvu)) {
        case 2:
          await tbPhieuNCCCTService.updatePhieuNhapHangNCC(items, reqData, t); // Gọi service với transaction
          break;
        case 5:
        case 6:
        case 7:
          await tbPhieuNCCCTService.updatePhieuNCCCT(reqData, items, t);
          break;
        default:
          break;
      }
    }

    // Commit transaction nếu tất cả thành công
    await t.commit();

    res.status(200).json({ message: "Cập nhật thành công", data: reqData });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await t.rollback();
    console.error("Error in creating Tb_PhieuNCC:", error);
    res.status(500).json({
      message: error ? error.message : "Đã xảy ra lỗi khi sửa phiếu nhập xuất",
    });
  }
};
const closeTb_PhieuNCC = async (req, res) => {
  const transaction = await sequelize.transaction(); // Tạo transaction mới
  try {
    const user = req.user.data;
    const ID_PhieuNX = req.params.id;
    const {
      ID_Nghiepvu,
      Sophieu,
      ID_NoiNhap,
      ID_NoiXuat,
      NgayNX,
      Ghichu,
      phieunccct,
      ID_Quy,
    } = req.body;

    // Get Thang and Nam details
    const Thang = await eThangService.getDetail(NgayNX);
    const Nam = await eNamService.getDetail(NgayNX);

    // Prepare data for Tb_PhieuNCC creation
    const reqData = {
      ID_PhieuNX: ID_PhieuNX,
      ID_Nghiepvu: ID_Nghiepvu,
      Sophieu: Sophieu,
      ID_NoiNhap: ID_NoiNhap,
      ID_NoiXuat: ID_NoiXuat,
      ID_Quy: ID_Quy,
      ID_Nam: Nam.ID_Nam,
      ID_Thang: Thang.ID_Thang,
      NgayNX: NgayNX,
      ID_User: user.ID_User,
      Ghichu: Ghichu,
      isDelete: 0,
    };

    await tbPhieuNCCService.closeTb_PhieuNCC(ID_PhieuNX, { transaction });

    if (
      (ID_Nghiepvu == 1 || ID_Nghiepvu == 2) &&
      phieunccct[0].ID_Taisan !== null
    ) {
      await tbTaiSanQrService.insertDataToEntQRCode(phieunccct, reqData, {
        transaction,
      });
    }

    await transaction.commit();

    res.status(200).json({
      message: "Đóng thành công!",
    });
  } catch (error) {
    // Rollback nếu có lỗi
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

const closeFastTb_PhieuNCC = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;
    // Prepare data for Tb_PhieuNCC creation

    await tbPhieuNCCService.closeTb_PhieuNCC(ID_PhieuNX);

    res.status(200).json({
      message: "Khóa phiếu thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTb_PhieuNCC = async (req, res) => {
  try {
    const ID_PhieuNX = req.params.id;
    await tbPhieuNCCService.deleteTb_PhieuNCC(ID_PhieuNX);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaiSanByPhongBanDA = async (req, res) => {
  try {
    const { ID_NoiNhap, ID_Loainhom, ID_Quy, ID_NoiXuat, ID_Nam, ID_Nghiepvu } =
      req.body;
    const data = await tbPhieuNCCCTService.getTaiSanPB(
      ID_NoiNhap,
      ID_NoiXuat,
      ID_Quy,
      ID_Nam,
      ID_Loainhom,
      ID_Nghiepvu
    );
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updatePhieuNCC = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const user = req.user.data;
    const ID_PhieuNCC = req.params.id;

    const {
      ID_Nghiepvu,
      Sophieu,
      ID_Phongban,
      ID_Phieu1,
      ID_Phieu2,
      ID_Loainhom,
      NgayNX,
      ID_Nam,
      ID_Thang,
      ID_Quy,
      Ghichu,
      iTinhtrang,
      isDelete,
      phieunccct,
    } = req.body;

    const reqData = {
      ID_Nghiepvu,
      ID_PhieuNCC,
      Sophieu,
      ID_Phongban,
      ID_Phieu1,
      ID_Phieu2,
      ID_Loainhom,
      NgayNX,
      ID_Nam,
      ID_Thang,
      ID_Quy,
      iTinhtrang,
      isDelete,
      ID_User: user.ID_User,
      Ghichu: Ghichu || "",
    };

    const checkphieunccct = phieunccct.filter((item) => item.isUpdate === 1);
    await tbPhieuNCCService.updatePhieuNCC(reqData, { transaction });
    if (checkphieunccct.length > 0) {
      await tbPhieuNCCCTService.updatePhieuNCCCT(reqData, checkphieunccct, {
        transaction,
      });
    }

    await transaction.commit();
    return res.status(202).json({ message: "Cập nhật thành công" });
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json({ message: `Có lỗi xả ra`, error: error.message });
  }
};

module.exports = {
  createTb_PhieuNCC,
  getAllTb_PhieuNCC,
  updateTb_PhieuNCC,
  deleteTb_PhieuNCC,
  getDetailTb_PhieuNCC,
  closeTb_PhieuNCC,
  getPhieuNCCByUser,
  closeFastTb_PhieuNCC,
  getPhieuNCCFilter,
  getTaiSanByPhongBanDA,
  updatePhieuNCC,
};
