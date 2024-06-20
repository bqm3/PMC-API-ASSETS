const {
  Ent_Taisan,
  Ent_Chinhanh,
  Ent_Nhompb,
  Ent_Nhomts,
  Ent_Donvi,
  Tb_SuachuaTS,
  Tb_SuachuaCT,
  Tb_TaisanQrCode,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createTb_Suachuats = async (data) => {
  const res = await Tb_SuachuaTS.create(data);
  return res;
};

const getDetailTb_Suachuats = async (Sophieu) => {
  const res = await Tb_SuachuaTS.findOne({
    attributes: [
      "Ngaytao",
      "Sophieu",
      "Nguoitheodoi",
      "iTinhtrang",
      "isDelete",
    ],
    where: {
      isDelete: 0,
      Sophieu: Sophieu,
    },
  });
  return res;
};

const getAllTb_Suachuats = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Tb_SuachuaTS.findAll({
    attributes: [
      "ID_Suachua",
      "Ngaygiao",
      "Sophieu",
      "Nguoitheodoi",
      "iTinhtrang",
      "isDelete",
    ],
    include: [
      {
        model: Tb_SuachuaCT,
        as: "tb_suachuact",
        attributes: [
          "ID_PhieuSCCT",
          "ID_SuachuaTS",
          "ID_TaisanQr",
          "Ngaynhan",
          "Sotien",
          "Ghichu",
          "isDelete",
        ],
        include: [
            {
                model: Tb_TaisanQrCode,
                as: "tb_taisanqrcode",
                attributes: [
                  "ID_TaisanQr",
                  "ID_Taisan",
                  "MaQrCode",
                  "Ngaykhoitao",
                  "iTinhtrang",
                  "isDelete",
                  "Ghichu",
                  "ID_Nam",
                  "ID_Thang",
                  "ID_Phongban",
                  "ID_Connguoi",
                ],
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

const deleteTb_Suachuats = async (id) => {
  const res = await Tb_SuachuaTS.update(
    { isDelete: 1 },
    {
      where: {
        ID_Suachua: id,
      },
    }
  );
  return res;
};

module.exports = {
  getDetailTb_Suachuats,
  getAllTb_Suachuats,
  createTb_Suachuats,
  deleteTb_Suachuats,
};
