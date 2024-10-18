const {
  Ent_Phongbanda,
  Ent_Taisan,
  Ent_Nhomts,
} = require("../models/setup.model");

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
};
