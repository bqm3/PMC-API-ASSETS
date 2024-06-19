const {
  Ent_GroupPolicy,
  Tb_PhieuNX,
  Ent_Nghiepvu,
  Ent_Nam,
  Ent_Thang,
  Ent_Connguoi,
  Ent_Nhompb,
  Ent_Phongbanda,
  Ent_Chinhanh,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createTb_PhieuNX = async (data) => {
  const res = await Tb_PhieuNX.create(data);
  return res;
};

const getAllTb_PhieuNX = async () => {
    // Điều kiện để lấy các bản ghi không bị xóa
    let whereClause = {
      isDelete: 0,
    };
  
    // Thực hiện truy vấn với Sequelize
    const res = await Tb_PhieuNX.findAll({
      attributes: [
        "ID_PhieuNX",
        "ID_Nghiepvu",
        "Sophieu",
        "ID_NoiNhap",
        "ID_NoiXuat",
        "ID_Connguoi",
        "NgayNX",
        "Ghichu",
        "ID_Nam",
        "ID_Thang",
        "iTinhtrang",
        "isDelete",
      ],
      include: [
        // Bao gồm quan hệ NhapPhieuNX với alias 'NoiNhap'
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
              attributes: ["ID_Nhompb","Nhompb", "isDelete"],
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
          model: Ent_Phongbanda,
          as: "NoiXuat", // Alias được sử dụng để phân biệt nơi xuất
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
              attributes: ["ID_Nhompb","Nhompb", "isDelete"],
              where: {
                isDelete: 0,
              },
            },
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
        {
          model: Ent_Nam,
          attributes: ["ID_Nam", "Nam", "Giatri"],
        },
        {
          model: Ent_Thang,
          attributes: ["ID_Thang", "Thang", "iThang"],
        },
        {
          model: Ent_Connguoi,
          attributes: [
            "ID_Connguoi",
            "MaPMC",
            "ID_Nhompb",
            "Hoten",
            "Gioitinh",
            "Diachi",
            "Sodienthoai",
            "Ghichu",
          ],
          include: [
            {
              model: Ent_Nhompb,
              attributes: ["ID_Nhompb","Nhompb", "isDelete"],
              where: {
                isDelete: 0,
              },
            },
          ],
        },
      ],
      where: whereClause,
    });
  
    return res;
  };
  

const updateTb_PhieuNX = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_Policy: data.ID_Policy,
  };

  const res = await Tb_PhieuNX.update(
    {
      Policy: data.Policy,
      ID_GroupPolicy: data.ID_GroupPolicy,
      GroupPolicy: data.GroupPolicy,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteTb_PhieuNX = async (ID) => {
  const res = await Tb_PhieuNX.update(
    { isDelete: 1 },
    {
      where: {
        ID_Policy: ID,
      },
    }
  );
  return res;
};

module.exports = {
  createTb_PhieuNX,
  getAllTb_PhieuNX,
  updateTb_PhieuNX,
  deleteTb_PhieuNX,
};
