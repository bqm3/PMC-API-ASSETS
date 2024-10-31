const {
  Ent_Phongbanda,
  Ent_Taisan,
  Ent_Nhomts,
  Tb_TaisanQrCode,
} = require("../models/setup.model");
const formatDateTime = require("../utils/formatDatetime");

const createQrCode = async (item, data, transaction) => {
  const taisan = await Ent_Taisan.findByPk(item.ID_Taisan, {
    attributes: ["ID_Taisan", "i_MaQrCode", "isDelete"],
    transaction,
  });

  if (taisan && Number(taisan.i_MaQrCode) === 0) {
    const [duan, taisanDetails] = await getDuanVsTaisanDetails(
      data.ID_Phieu1,
      taisan.ID_Taisan
    );

    const Thuoc = duan?.Thuoc;
    const ManhomTs = taisanDetails.ent_nhomts.Manhom;
    const MaID = taisanDetails.ID_Taisan;
    const MaTaisan = taisanDetails.Mats;
    const Ngay = formatDateTime(data.NgayNX);

    const qrCodes = [];
    for (let i = 1; i <= Number(item.Soluong); i++) {
      qrCodes.push({
        ID_Nam: data.ID_Nam,
        ID_Quy: data.ID_Quy,
        ID_Taisan: item.ID_Taisan,
        ID_PhieuNCCCT: item?.ID_PhieuNCCCT,
        ID_PhieuNXCT: item?.ID_PhieuNXCT,
        ID_Phongban: data.ID_Phieu1 ?? data.ID_NoiNhap,
        Giatri: item.Dongia,
        Ngaykhoitao: data.NgayNX,
        MaQrCode: `${Thuoc}|${data.ID_Phieu1}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${i}`,
        Namsx: item.Namsx,
        Nambdsd: null,
        Ghichu: "",
        iTinhtrang: 0,
      });
    }
    await Tb_TaisanQrCode.bulkCreate(qrCodes, { transaction });
  }
};

const getDuanVsTaisanDetails = async (ID_Phongban, ID_Taisan) => {
  const [duan, taisanDetails] = await Promise.all([
    Ent_Phongbanda.findOne({
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
        ID_Phongban: ID_Phongban,
      },
    }),
    Ent_Taisan.findOne({
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
        ID_Taisan: ID_Taisan,
        isDelete: 0,
      },
    }),
  ]);

  return [duan, taisanDetails];
};

module.exports = {
  getDuanVsTaisanDetails,
  createQrCode,
};
