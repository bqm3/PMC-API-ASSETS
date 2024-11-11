const {
  Ent_Taisan,
  Ent_Chinhanh,
  Ent_Nhompb,
  Ent_Nhomts,
  Ent_Donvi,
  Tb_SuachuaTS,
  Tb_SuachuaCT,
  Tb_TaisanQrCode,
  Ent_Phongbanda,
  Ent_Connguoi,
  Ent_User,
} = require("../models/setup.model");
const { Op } = require("sequelize");

const createTb_Suachuats = async (data) => {
  const res = await Tb_SuachuaTS.create(data);
  return res;
};
const createTb_Suachuact = async (suachuact, data) => {
  await Promise.all(
    suachuact.map(async (item) => {
      const res = await Tb_TaisanQrCode.findByPk(item.ID_TaisanQr, {
        attributes: [
          "ID_TaisanQr",
          "ID_Taisan", "Giatri",
          "MaQrCode",
          "Ngaykhoitao",
          "iTinhtrang",
          "isDelete", "Ghichu", "ID_Nam", "ID_Thang", "ID_Phongban", "ID_User",
        ],
        where: {
          isDelete: 0
        }
      })
      // Thực hiện insert dữ liệu từ mỗi item trong mảng phieunxct
      await Tb_SuachuaCT.create({
        ID_SuachuaTS: data.ID_SuachuaTS,
        ID_TaisanQr: item.ID_TaisanQr,
        ID_Taisan: res.ID_Taisan,
        Ngaynhan: item.Ngaynhan,
        Sotien: item.Sotien,
        Ghichu: item.Ghichu,
        isDelete: 0,
      });
    })
  );
};

const getDetailTb_Suachuats = async (ID_SuachuaTS) => {
  const res = await Tb_SuachuaTS.findOne({
    attributes: [
      "ID_SuachuaTS",
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
          "ID_TaisanQr", "ID_Taisan",
          "Ngaynhan",
          "Sotien",
          "Ghichu",
          "isDelete",
        ],
        where: { isDelete: 0 },
        include: [
          {
            model: Tb_TaisanQrCode,
            as: "tb_taisanqr",
            attributes: [
              "ID_TaisanQr",
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
                    where: { isDelete: 0 }, // Check if this is too restrictive
                  },
                  {
                    model: Ent_Donvi,
                    as: "ent_donvi",
                    attributes: ["ID_Donvi", "Donvi", "isDelete"],
                    where: { isDelete: 0 }, // Check if this is too restrictive
                  },
                ],
                where: { isDelete: 0 }, // Ensure this condition matches the expected data
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
                include: [
                  {
                    model: Ent_Chinhanh,
                    attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
                    where: { isDelete: 0 },
                  },
                  {
                    model: Ent_Nhompb,
                    attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
                    where: { isDelete: 0 },
                  },
                ],
                where: { isDelete: 0 },
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
            where: { isDelete: 0 },
          },
        ],
      },
    ],
    where: {
      isDelete: 0,
      ID_SuachuaTS: ID_SuachuaTS,
    },
    logging: console.log, // Enable SQL logging to debug the generated query
  });


  return res;
};

const getAllTb_Suachuats = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Tb_SuachuaTS.findAll({
    attributes: [
      "ID_SuachuaTS",
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
          "ID_TaisanQr", "ID_Taisan",
          "Ngaynhan",
          "Sotien",
          "Ghichu",
          "isDelete",
        ],
        where: { isDelete: 0 },
        include: [
          {
            model: Tb_TaisanQrCode,
            as: "tb_taisanqr",
            attributes: [
              "ID_TaisanQr",
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
                    where: { isDelete: 0 }, // Check if this is too restrictive
                  },
                  {
                    model: Ent_Donvi,
                    as: "ent_donvi",
                    attributes: ["ID_Donvi", "Donvi", "isDelete"],
                    where: { isDelete: 0 }, // Check if this is too restrictive
                  },
                ],
                where: { isDelete: 0 }, // Ensure this condition matches the expected data
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
                include: [
                  {
                    model: Ent_Chinhanh,
                    attributes: ["ID_Chinhanh", "Tenchinhanh", "isDelete"],
                    where: { isDelete: 0 },
                  },
                  {
                    model: Ent_Nhompb,
                    attributes: ["ID_Nhompb", "Nhompb", "isDelete"],
                    where: { isDelete: 0 },
                  },
                ],
                where: { isDelete: 0 },
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
            where: { isDelete: 0 },
          },
        ],
      },
    ],
    where: whereClause,
  });

  return res;
};

const updateTb_Suachuats = async (data) => {
  let whereClause = {
    isDelete: 0,
    ID_SuachuaTS: data.ID_SuachuaTS,
  };

  const res = await Tb_SuachuaTS.update(
    {
      Sophieu: data.Sophieu,
      Ngaygiao: data.Ngaygiao,
      Nguoitheodoi: data.Nguoitheodoi,
      Tinhtrang: data.Tinhtrang,
    },
    {
      where: whereClause,
    }
  );
  return res;
};

const updateTb_Suachuact = async (suachuact, data) => {
  await Promise.all(
    suachuact.map(async (item) => {
      const res = await Tb_TaisanQrCode.findOne({
        where: {
          ID_TaisanQr: item.ID_TaisanQr,
          isDelete: 0
        },
        attributes: [
          "ID_TaisanQr", "ID_Taisan", "Giatri", "MaQrCode",
          "Ngaykhoitao", "iTinhtrang", "isDelete", "Ghichu",
          "ID_Nam", "ID_Thang", "ID_Phongban", "ID_User"
        ]
      });

      // Thực hiện insert dữ liệu từ mỗi item trong mảng phieunxct
      await Tb_SuachuaCT.update({
        ID_SuachuaTS: data.ID_SuachuaTS,
        ID_TaisanQr: item.ID_TaisanQr,
        ID_Taisan: res.ID_Taisan,
        Ngaynhan: item.Ngaynhan,
        Sotien: item.Sotien,
        Ghichu: item.Ghichu,
        isDelete: item.isDelete,
      },{
        where: {
          ID_PhieuSCCT: item.ID_PhieuSCCT
        }
      });
    })
  );
};


const closeTb_SuachuaTs = async (ID) => {
  const res = await Tb_SuachuaTS.update(
    { iTinhtrang: 1 },
    {
      where: {
        ID_SuachuaTS: ID,
      },
    }
  );
  return res;
};

const deleteTb_Suachuats = async (id) => {
  const res = await Tb_SuachuaTS.update(
    { isDelete: 1 },
    {
      where: {
        ID_SuachuaTS: id,
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
  createTb_Suachuact,
  updateTb_Suachuats,
  closeTb_SuachuaTs,
  updateTb_Suachuact
};
