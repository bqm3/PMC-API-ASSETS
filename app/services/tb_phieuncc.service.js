const {
  Ent_GroupPolicy,
  Tb_PhieuNCC,
  Ent_Nghiepvu,
  Ent_Nam,
  Ent_Thang,
  Ent_Connguoi,
  Ent_Nhompb,
  Ent_Phongbanda,
  Ent_Chinhanh,
  Tb_PhieuNCCCT,
  Tb_TaisanQrCode,
  Ent_Taisan,
  Ent_User,
  Ent_Quy,
  Ent_Loainhom,
  Ent_Nhacc,
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const tbPhieuNCCCTService = require("../services/tb_phieunccct.service");
const { Op } = require("sequelize");

// nghiep vụ nha cung cap
const createTb_PhieuNCC = async (phieunccct, data) => {
  const transaction = await sequelize.transaction();
  try {

    const existingRecord = await Tb_PhieuNCC.findOne({
      where: {
        iTinhtrang: 1,
        ID_Phieu1: data.ID_Phieu1,
        isDelete: 0,
      },
      transaction
    });

    // Nếu có phiếu phù hợp với điều kiện trên, báo lỗi và rollback transaction
    if (existingRecord) {
      throw new Error('Phòng ban xuất phải khóa các phiếu');
    }
    // Tạo bản ghi Tb_PhieuNCC
    const res = await Tb_PhieuNCC.create(data, { transaction });

    // Kiểm tra nếu phieunccct có giá trị và chứa ID_Taisan hợp lệ
    if (phieunccct.length > 0 && phieunccct[0].ID_Taisan != null) {
      // Nghiệp vụ 2: Nhập hàng từ nhà cung cấp
      if (data.ID_Nghiepvu == 2) {
        console.log('vao nghiep vu 2')
        await tbPhieuNCCCTService.create_PhieuNhapNCC(phieunccct, res, transaction);
      } 
      // Nghiệp vụ 5,6,7: Xuất trả nhà cung cấp
      else {
        console.log('vao nghiep vu 5,6,7')
        // Sử dụng Promise.all để tạo nhiều Phiếu xuất cùng lúc
        await Promise.all(
          phieunccct.map(item => tbPhieuNCCCTService.create_PhieuXuatNCC(item, res, transaction))
        );
      }
    }

    // Commit transaction nếu không có lỗi
    await transaction.commit();
    return res;
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    throw new Error(error.message || 'Có lỗi xảy ra !');
  }
};

const updateTb_PhieuNCC = async (data) => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Tb_PhieuNCC.findByPk(
    data.ID_PhieuNCC,
    {
      ID_Nghiepvu: data.ID_Nghiepvu,
      Sophieu: data.Sophieu,
      ID_NoiNhap: data.ID_NoiNhap,
      ID_NoiXuat: data.ID_NoiXuat,
      ID_Nam: data.ID_Nam,
      ID_Loainhom: data.ID_Loainhom,
      ID_Thang: data.ID_Thang,
      NgayNX: data.NgayNX,
      ID_User: data.ID_User,
      Ghichu: data.Ghichu,
      ID_Quy: data.ID_Quy,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const getDetailTb_PhieuNCC = async (ID_PhieuNCC) => {
  let whereClause = {
    isDelete: 0,
    ID_PhieuNCC: ID_PhieuNCC,
  };

  const res = await Tb_PhieuNCC.findOne({
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
    ],
    include: [
      // Bao gồm quan hệ NhapPhieuNX với alias 'NoiNhap'
      {
        model: Ent_Phongbanda,
        as: "ent_phongbanda", // Alias được sử dụng để phân biệt nơi nhập
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
        include: [
          {
            model: Ent_Chinhanh,
            attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
            where: {
              isDelete: 0,
            },
          },
          {
            model: Ent_Nhompb,
            attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          isDelete: 0,
        },
      },
      // Bao gồm quan hệ XuatPhieuNX với alias 'NoiXuat'
      {
        model: Ent_Nhacc,
        as: "ent_nhacc", // Alias được sử dụng để phân biệt nơi xuất
        attributes: [
          "ID_Nhacc",
          "MaNhacc",
          "TenNhacc",
          "Masothue",
          "Sodienthoai",
          "Sotaikhoan",
          "Nganhang",
          "Diachi",
          "Ghichu",
          "isDelete",
        ],
        where: {
          isDelete: 0,
        },
      },
      // Bao gồm các bảng liên kết khác
      {
        model: Ent_Nghiepvu,
        attributes: ["ID_Nghiepvu", "Nghiepvu", "isDelete"],
        where: {
          isDelete: 0,
        },
      },
      // Loainhom
      {
        model: Ent_Loainhom,
        as: "ent_loainhom",
        attributes: ["ID_Loainhom", "Loainhom", "isDelete"],
      },
      {
        model: Ent_Nam,
        attributes: ["ID_Nam", "Nam", "Giatri"],
      },
      //Quy
      {
        model: Ent_Quy,
        attributes: ["ID_Quy", "Quy"],
      },
      {
        model: Ent_Thang,
        attributes: ["ID_Thang", "Thang", "iThang"],
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
            model: Ent_Phongbanda,
            as: "ent_phongbanda",
            attributes: ["ID_Phongban", "TenPhongban"],
          },
        ],
      },
      {
        model: Tb_PhieuNCCCT,
        as: "tb_phieunccct",
        attributes: [
          "ID_PhieuNCCCT",
          "ID_PhieuNCC",
          "ID_Taisan",
          "ID_TaisanQrcode",
          "Dongia",
          "Namsx",
          "Soluong",
          "isDelete",
        ],
        include: [
          {
            model: Ent_Taisan,
            attributes: [
              "ID_Taisan",
              "ID_Nhomts",
              "ID_Donvi",
              "Mats",
              "Tents",
              "Thongso",
              "Ghichu",
              "isDelete",
            ],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          ID_PhieuNCC: ID_PhieuNCC,
          isDelete: 0,
        },
        required: false, // Allow null values
      },
    ],
    where: whereClause,
  });

  return res;
};

const getAllTb_PhieuNCC = async () => {
  // Điều kiện để lấy các bản ghi không bị xóa
  let whereClause = {
    isDelete: 0,
  };

  // Thực hiện truy vấn với Sequelize
  const res = await Tb_PhieuNCC.findAll({
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
    where: { isDelete: 0 },
    order: [["NgayNX", "DESC"]],
  });

  return res;
};

const getAllTb_PhieuNCC_By_NghiepVu = async (arr_NghiepVu) => {

  // Thực hiện truy vấn với Sequelize
  const res = await Tb_PhieuNCC.findAll({
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
    where: { ID_Nghiepvu: {[Op.in]: arr_NghiepVu},isDelete: 0 },
    order: [["NgayNX", "DESC"]],
  });

  return res;
};

const getPhieuNCCByUser = async (ID_User, ID_Quy) => {
  let whereClause = {
    isDelete: 0,
    ID_Quy: ID_Quy,
    iTinhtrang: 0,
  };

  // Thực hiện truy vấn với Sequelize
  const res = await Tb_PhieuNCC.findAll({
    attributes: [
      "ID_PhieuNCC",
      "ID_Nghiepvu",
      "Sophieu",
      "ID_NoiNhap",
      "ID_NoiXuat",
      "ID_User",
      "NgayNX",
      "Ghichu",
      "ID_Nam",
      "ID_Thang",
      "ID_Quy",
      "iTinhtrang",
      "isDelete",
    ],
    include: [
      // Phong ban dự án
      {
        model: Ent_Phongbanda,
        as: "NoiNhap", // Alias được sử dụng để phân biệt nơi nhập
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
        include: [
          {
            model: Ent_Chinhanh,
            attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
            where: {
              isDelete: 0,
            },
          },
          {
            model: Ent_Nhompb,
            attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          isDelete: 0,
        },
      },
      {
        model: Ent_Nhacc,
        as: "NoiXuat", // Alias được sử dụng để phân biệt nơi xuất
        attributes: [
          "ID_Nhacc",
          "MaNhacc",
          "TenNhacc",
          "Masothue",
          "Sodienthoai",
          "Sotaikhoan",
          "Nganhang",
          "Diachi",
          "Ghichu",
          "isDelete",
        ],
        where: {
          isDelete: 0,
        },
      },
      // Bao gồm các bảng liên kết khác
      // Nghiep vu
      {
        model: Ent_Nghiepvu,
        attributes: ["ID_Nghiepvu", "Nghiepvu", "isDelete"],
        where: {
          isDelete: 0,
        },
      },
      // Nam
      {
        model: Ent_Nam,
        attributes: ["ID_Nam", "Nam", "Giatri"],
      },
      //Quy
      {
        model: Ent_Quy,
        attributes: ["ID_Quy", "Quy"],
      },
      // Thang
      {
        model: Ent_Thang,
        attributes: ["ID_Thang", "Thang", "iThang"],
      },
      // User
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
        ],
        include: [
          {
            model: Ent_Nhompb,
            attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          ID_User: ID_User,
          isDelete: 0,
        },
      },
      // Phieu NXCT
      {
        model: Tb_PhieuNCCCT,
        as: "tb_phieunCCct",
        attributes: [
          "ID_PhieuNCCCT",
          "ID_PhieuNCC",
          "ID_Taisan",
          "Dongia",
          "Namsx",
          "Soluong",
          "isDelete",
        ],
        include: [
          {
            model: Ent_Taisan,
            attributes: [
              "ID_Taisan",
              "ID_Nhomts",
              "ID_Donvi",
              "Mats",
              "Tents",
              "Thongso",
              "Ghichu",
              "isDelete",
            ],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          isDelete: 0,
        },
        required: false, // Allow null values
      },
    ],
    where: whereClause,
  });

  return res;
};

const closeTb_PhieuNCC = async (ID) => {
  const res = await Tb_PhieuNCC.update(
    { iTinhtrang: 1 },
    {
      where: {
        ID_PhieuNCC: ID,
      },
    }
  );
  return res;
};

const deleteTb_PhieuNCC = async (ID) => {
  const transaction = await sequelize.transaction();

  try {
    const res = await Tb_PhieuNCC.update(
      { isDelete: 1 },
      {
        where: { ID_PhieuNCC: ID },
        transaction,
      }
    );

    await tbPhieuNCCCTService.deleteTb_PhieuNCCCT(ID, transaction);
    await transaction.commit();

    return res;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updatePhieuNCC = async (data) => {
  try {
    const rowsUpdated = await Tb_PhieuNCC.update(
      {
        Sophieu: data.Sophieu,
        ID_User: data.ID_User,
        Ghichu: data.Ghichu,
      },
      {
        where: {
          ID_PhieuNCC: data.ID_PhieuNCC,
          isDelete: 0,
        },
      }
    );

    return rowsUpdated;
  } catch (error) {
    console.error("Lỗi khi cập nhật Tb_PhieuNCC:", error);
    throw error instanceof Error
      ? error
      : new Error("Có lỗi xảy ra khi cập nhật phiếu NCC.");
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
  updatePhieuNCC,
  getAllTb_PhieuNCC_By_NghiepVu,
};
