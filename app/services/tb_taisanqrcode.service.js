const {
  Tb_TaisanQrCode,
  Ent_Taisan,
  Ent_Nhomts,
  Ent_Donvi,
  Ent_Nghiepvu,
  Ent_Phongbanda,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createTb_taisanqrcode = async (data) => {
  const res = await Tb_TaisanQrCode.create(data);
  return res;
};

const getAlleTb_taisanqrcode = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Tb_TaisanQrCode.findAll({
    attributes: [
      "ID_TaisanQrCode",
      "ID_Taisan",
      "MaQrCode",
      "Ngaykhoitao",
      "iTinhtrang",
      "isDelete",
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
            attributes: ["ID_Nhomts", "Manhom", "Loaits", "isDelete"],
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
    where: whereClause,
  });
  return res;
};

const getDetailTb_taisanqrcode = async (id) => {
  const res = await Tb_TaisanQrCode.findByPk(id, {
    attributes: [
      "ID_TaisanQrCode",
      "ID_Taisan",
      "MaQrCode",
      "Ngaykhoitao",
      "iTinhtrang",
      "isDelete",
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
            attributes: ["ID_Nhomts", "Manhom", "Loaits", "isDelete"],
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
    ID_TaisanQrCode: data.ID_TaisanQrCode,
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
        ID_TaisanQrCode: id,
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
            ID_Chinhanh: data.ID_NoiNhap,
            isDelete: 0,
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
              attributes: ["ID_Nhomts", "Manhom", "Loaits", "isDelete"],
              where: { isDelete: 0 },
            },
          ],
          where: {
            ID_Taisan: item.ID_Taisan,
            isDelete: 0,
          },
        });

        const Thuoc = duan.Thuoc;
        const ManhomTs = taisan.ent_nhomts.Manhom;
        const MaID = taisan.ID_Taisan;
        const MaTaisan = taisan.Mats;
        const Ngay = formatDateTime(data.NgayNX);

        const MaQrCode = `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;

        await Tb_TaisanQrCode.create({
          ID_Taisan: item.ID_Taisan,
          Ngaykhoitao: data.NgayNX,
          Giatri: item.Dongia,
          MaQrCode: MaQrCode,
          Ghichu: "",
          ID_Nam: data.ID_Nam,
          iTinhtrang: 0,
          ID_Thang: data.ID_Thang,
          ID_Phongban: data.ID_NoiNhap,
          ID_Connguoi: data.ID_Connguoi,
        });
      })
    );

    console.log("Insert thành công vào Ent_QRCode");
  } catch (error) {
    console.error("Lỗi khi insert vào Ent_QRCode:", error);
    throw error;
  }
};

module.exports = {
  createTb_taisanqrcode,
  getAlleTb_taisanqrcode,
  updateleTb_taisanqrcode,
  deleteTb_taisanqrcode,
  getDetailTb_taisanqrcode,
  insertDataToEntQRCode,
};


function formatDateTime(data) {
  if (typeof data === 'string' && data.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
    const date = new Date(data); // Chuyển đổi chuỗi ngày tháng thành đối tượng Date
    const year = date.getFullYear().toString().slice(2); // Lấy 2 chữ số cuối của năm
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng với 2 chữ số, thêm số 0 nếu cần
    const day = date.getDate().toString().padStart(2, '0'); // Ngày với 2 chữ số, thêm số 0 nếu cần

    return `${year}${month}${day}`;
  } else {
    throw new Error('Invalid date format');
  }
}
