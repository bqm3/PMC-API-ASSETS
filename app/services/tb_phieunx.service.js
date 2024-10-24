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
  Tb_PhieuNXCT,
  Tb_TaisanQrCode,
  Ent_Taisan,
  Ent_User,
  Ent_Quy,
  Ent_Loainhom,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createTb_PhieuNX = async (data) => {
  const res = await Tb_PhieuNX.create(data);
  return res;
};

const getDetailTb_PhieuNX = async(ID_PhieuNX) => {
  let whereClause = {
    isDelete: 0,
    ID_PhieuNX: ID_PhieuNX,
  };

  const res = await Tb_PhieuNX.findOne({
    attributes: [
      "ID_PhieuNX",
      "ID_Nghiepvu",
      "Sophieu",
      "ID_NoiNhap",
      "ID_NoiXuat",
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
         // Loainhom
         {
          model: Ent_Loainhom,
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
        ],
        
      },
      {
        model: Tb_PhieuNXCT,
        as: "tb_phieunxct",
        attributes: [
          "ID_PhieuNXCT",
          "ID_PhieuNX",
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
            attributes: [ "ID_Taisan",
              "ID_Nhomts",
              "ID_Donvi",
              "Mats",
              "Tents",
              "Thongso",
              "Ghichu",
              "isDelete",],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          ID_PhieuNX: ID_PhieuNX,
          isDelete: 0
        },
        required: false, // Allow null values
      },
    ],
    where: whereClause,
  });

  return res;
}

const getAllTb_PhieuNX = async () => {
    // Điều kiện để lấy các bản ghi không bị xóa
    let whereClause = {
      isDelete: 0
    };
  
    // Thực hiện truy vấn với Sequelize
    const res = await Tb_PhieuNX.findAll({
      attributes: [
        "ID_PhieuNX",
        "ID_Nghiepvu",
        "Sophieu",
        "ID_NoiNhap",
        "ID_NoiXuat",
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
         // Loainhom
         {
          model: Ent_Loainhom,
          attributes: ["ID_Loainhom", "Loainhom", "isDelete"],
        },
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
              attributes: ["ID_Nhompb","Nhompb", "isDelete"],
              where: {
                isDelete: 0,
              },
            },
          ],
        },
        // Phieu NXCT
        {
          model: Tb_PhieuNXCT,
          as: "tb_phieunxct",
          attributes: [
            "ID_PhieuNXCT",
            "ID_PhieuNX",
            "ID_Taisan",
            "Dongia",
            "Namsx",
            "Soluong",
            "isDelete",
          ],
          include: [
            {
              model: Ent_Taisan,
              attributes: [ "ID_Taisan",
                "ID_Nhomts",
                "ID_Donvi",
                "Mats",
                "Tents",
                "Thongso",
                "Ghichu",
                "isDelete",],
              where: {
                isDelete: 0,
              },
            },
          ],
          where: {
            isDelete: 0
          },
         
          required: false, // Allow null values
        },
        
      ],
      where: whereClause,
      order: [
        ['NgayNX', 'DESC'],
    ],
    });

    return res;
  };

const getPhieuNXByUser = async(ID_User, ID_Quy) => {
  let whereClause = {
    isDelete: 0,
    ID_Quy: ID_Quy,
    ID_Nghiepvu: 7,
    iTinhtrang: 0
  };

  // Thực hiện truy vấn với Sequelize
  const res = await Tb_PhieuNX.findAll({
    attributes: [
      "ID_PhieuNX",
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
            attributes: ["ID_Nhompb","Nhompb", "isDelete"],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          ID_User: ID_User,
          isDelete: 0
        }
      },
      // Phieu NXCT
      {
        model: Tb_PhieuNXCT,
        as: "tb_phieunxct",
        attributes: [
          "ID_PhieuNXCT",
          "ID_PhieuNX",
          "ID_Taisan",
          "Dongia",
          "Namsx",
          "Soluong",
          "isDelete",
        ],
        include: [
          {
            model: Ent_Taisan,
            attributes: [ "ID_Taisan",
              "ID_Nhomts",
              "ID_Donvi",
              "Mats",
              "Tents",
              "Thongso",
              "Ghichu",
              "isDelete",],
            where: {
              isDelete: 0,
            },
          },
        ],
        where: {
          isDelete: 0
        },
        required: false, // Allow null values
      },
      
    ],
    where: whereClause,
  });

  return res;
}
  
const updateTb_PhieuNX = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_PhieuNX: data.ID_PhieuNX,
  };

  const res = await Tb_PhieuNX.update(
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
      ID_Quy: data.ID_Quy
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const closeTb_PhieuNX = async (ID) => {
  const res = await Tb_PhieuNX.update(
    { iTinhtrang: 1 },
    {
      where: {
        ID_PhieuNX: ID,
      },
    }
  );
  return res;
};

const deleteTb_PhieuNX = async (ID,transaction) => {
  try{
    const res = await Tb_PhieuNX.update(
      { isDelete: 1 },
      {
        where: {
          ID_PhieuNX: ID,
        },
        transaction,
      }
    );
    return res;
  } catch (error) {
    throw error
  }
};

module.exports = {
  createTb_PhieuNX,
  getAllTb_PhieuNX,
  updateTb_PhieuNX,
  deleteTb_PhieuNX,
  getDetailTb_PhieuNX,
  closeTb_PhieuNX,
  getPhieuNXByUser
};
