const { uploadFile } = require("../middleware/image.middleware");
const { Ent_PhieuNCCCT } = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");

const createTb_PhieuCCCT = async (phieunccct, data) => {
  const groupedItems = {};

  // Nhóm và tính tổng theo ID_Taisan
  phieunccct.forEach((item) => {
    const {ID_TaisanQrcode , ID_Taisan, Dongia, Soluong, Chietkhau, Namsx, Anhts } = item;
    if (!groupedItems[ID_Taisan]) {
      groupedItems[ID_Taisan] = {
        ID_TaisanQrcode,
        ID_Taisan,
        Namsx,
        Dongia: 0,
        Soluong: 0,
        Chietkhau: 0,
        Anhts
      };
    }
    // Cộng dồn tổng Dongia và Soluong
    groupedItems[ID_Taisan].Dongia = Number(Dongia);
    groupedItems[ID_Taisan].Soluong += Number(Soluong);
    groupedItems[ID_Taisan].Chietkhau = Number(Chietkhau);
  });
  await Promise.all(
    Object.values(groupedItems).map(async (groupedItem) => {
      await Ent_PhieuNCCCT.create({
        ID_PhieuNCC: data.ID_PhieuNCC,
        ID_TaisanQrcode: groupedItem.ID_TaisanQrcode,
        ID_Taisan: groupedItem.ID_Taisan,
        Namsx: groupedItem.Namsx,
        Dongia: groupedItem.Dongia,
        Soluong: groupedItem.Soluong,
        Chietkhau: groupedItem.Chietkhau,
        Anhts: groupedItem.Anhts,
        isDelete: 0,
      });
    })
  );
};
