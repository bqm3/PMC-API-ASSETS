const {
  Tb_TaisanQrCode,
  Ent_Taisan,
  Ent_Nhomts,
  Ent_Donvi,
  Ent_Nghiepvu,
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhompb,
  Ent_Connguoi,
  Ent_User,
} = require("../models/setup.model");
const { Op } = require("sequelize");
const { uploadFile } = require("../middleware/image.middleware");

const createTb_taisanqrcode = async (data) => {
  const res = await Tb_TaisanQrCode.create(data);
  return res;
};

const getAllTb_taisanqrcode = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Tb_TaisanQrCode.findAll({
    attributes: [
      "ID_TaisanQrcode",
      "ID_Taisan",
      "Giatri",
      "MaQrCode",
      "Ngaykhoitao",
      "iTinhtrang",
      "isDelete",
      "Ghichu",
      "ID_Nam",
      "ID_Thang",
      "ID_Phongban",
      "ID_User",
    ],
    include: [
      {
        model: Ent_Taisan,
        as: "ent_taisan",
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
        include: [
          {
            model: Ent_Nhomts,
            as: "ent_nhomts",
            attributes: ["ID_Nhomts", "Manhom", "Tennhom", "isDelete"],
            where: { isDelete: 0 },
          },
          {
            model: Ent_Donvi,
            as: "ent_donvi",
            attributes: ["ID_Donvi", "Donvi", "isDelete"],
            where: { isDelete: 0 },
          },
        ],
        where: { isDelete: 0 },
      },
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
      {
        model: Ent_User,
        as: "ent_user",
        attributes: [
          "ID_Nhompb",
          "MaPMC",
          "ID_Chinhanh",
          "ID_Chucvu",
          "Hoten",
          "Gioitinh",
          "Diachi",
          "Sodienthoai",
          "Ghichu",
        ],
      },
    ],
    where: whereClause,
  });
  return res;
};

const getDetailTb_taisanqrcode = async (id) => {
  const res = await Tb_TaisanQrCode.findByPk(id, {
    attributes: [
      "ID_TaisanQrcode",
      "ID_Taisan",
      "Giatri",
      "MaQrCode",
      "Ngaykhoitao",
      "iTinhtrang",
      "isDelete",
      "Ghichu",
      "ID_Nam",
      "ID_Thang",
      "Namsx",
      "Nambdsd",
      "Image",
      "ID_Phongban",
      "ID_User",
    ],
    include: [
      {
        model: Ent_Taisan,
        as: "ent_taisan",
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
        include: [
          {
            model: Ent_Nhomts,
            as: "ent_nhomts",
            attributes: ["ID_Nhomts", "Manhom", "Tennhom", "isDelete"],
            where: { isDelete: 0 },
          },
          {
            model: Ent_Donvi,
            as: "ent_donvi",
            attributes: ["ID_Donvi", "Donvi", "isDelete"],
            where: { isDelete: 0 },
          },
        ],
        where: { isDelete: 0 },
      },
    ],
    where: {
      isDelete: 0,
    },
  });
  return res;
};

const updateleTb_taisanqrcode = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_TaisanQr: data.ID_TaisanQr,
  };

  const res = await Tb_TaisanQrCode.update(
    {
      ID_Taisan: data.ID_Taisan,
      MaQrCode: data.MaQrCode,
      Ngaykhoitao: data.Ngaykhoitao,
      iTinhtrang: data.iTinhtrang,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const deleteTb_taisanqrcode = async (id) => {
  const res = await Tb_TaisanQrCode.update(
    { isDelete: 1 },
    {
      where: {
        ID_TaisanQr: id,
      },
    }
  );
  return res;
};

const insertDataToEntQRCode = async (phieunxct, data) => {
  try {
    // Sử dụng Promise.all để chạy các lệnh insert đồng thời
    await Promise.all(
      phieunxct.map(async (item) => {
        // Thực hiện insert dữ liệu từ mỗi item trong mảng phieunxct
        const duan = await Ent_Phongbanda.findOne({
          attributes: [
            "ID_Phongban",
            "ID_Chinhanh",
            "ID_Nhompb",
            "Mapb",
            "Thuoc",
            "Tenphongban",
            "Diachi",
            "Ghichu",
            "isDelete",
          ],
          where: {
            isDelete: 0,
            ID_Phongban: data.ID_NoiNhap,
          },
        });

        const taisan = await Ent_Taisan.findOne({
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
          include: [
            {
              model: Ent_Nhomts,
              as: "ent_nhomts",
              attributes: ["ID_Nhomts", "Manhom", "Tennhom", "isDelete"],
              where: { isDelete: 0 },
            },
          ],
          where: {
            ID_Taisan: item.ID_Taisan,
            isDelete: 0,
          },
        });

        const Thuoc = duan?.Thuoc;
        const ManhomTs = taisan.ent_nhomts.Manhom;
        const MaID = taisan.ID_Taisan;
        const MaTaisan = taisan.Mats;
        const Ngay = formatDateTime(data.NgayNX);

        const createQrCodeEntry = async (index) => {
          const MaQrCode = index >= 1 
            ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}` 
            : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;

          await Tb_TaisanQrCode.create({
            ID_Taisan: item.ID_Taisan,
            ID_PhieuNXCT: item.ID_PhieuNXCT,
            Ngaykhoitao: data.NgayNX,
            Giatri: item.Dongia,
            Namsx: item.Namsx,
            MaQrCode: MaQrCode,
            Ghichu: "",
            ID_Nam: data.ID_Nam,
            iTinhtrang: 0,
            ID_Quy: data.ID_Quy,
            ID_Phongban: data.ID_NoiNhap,
            ID_User: data.ID_User,
          });
        };

        if (`${item.Soluong}` > "1") {
          for (let i = 1; i <= item.Soluong; i++) {
            await createQrCodeEntry(i);
          }
        } else {
          await createQrCodeEntry(1);
        }
      })
    );
  } catch (error) {
    console.error("Lỗi khi insert vào Ent_QRCode:", error);
    throw error;
  }
};


const scanQrCodeTb_Taisanqrcode = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_TaisanQr: data.ID_TaisanQr,
  };
  const file = await uploadFile(data.images);

  const res = await Tb_TaisanQrCode.update(
    {
      Ghichu: data.Ghichu,
      Image: file ? file.id : "",
      iTinhtrang: data.iTinhtrang,
      ID_User: data.user.ID_User,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

module.exports = {
  createTb_taisanqrcode,
  getAllTb_taisanqrcode,
  updateleTb_taisanqrcode,
  deleteTb_taisanqrcode,
  getDetailTb_taisanqrcode,
  insertDataToEntQRCode,
  scanQrCodeTb_Taisanqrcode,
};

function formatDateTime(data) {
  // Regular expressions for different date formats
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  const simpleDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (
    typeof data === "string" &&
    (data.match(iso8601Regex) || data.match(simpleDateRegex))
  ) {
    const date = new Date(data); // Convert the string to a Date object
    if (isNaN(date)) {
      throw new Error("Invalid date value");
    }

    const year = date.getFullYear().toString().slice(2); // Get last 2 digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure month is two digits
    const day = date.getDate().toString().padStart(2, "0"); // Ensure day is two digits

    return `${year}${month}${day}`;
  } else {
    throw new Error("Invalid date format");
  }
}
