const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_TaisanQrCode = sequelize.define(
  "tb_taisanqrcode",
  {
    ID_TaisanQrcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
    },
    ID_PhieuNXCT: {
      type: DataTypes.INTEGER,
    },
    ID_PhieuNCCCT: {
      type: DataTypes.INTEGER,
    },
    MaQrCode: {
      type: DataTypes.CHAR,
    },
    Ngaykhoitao: {
      type: DataTypes.DATE,
    },
    Giatri: {
      type: DataTypes.DOUBLE,
    },
    ID_Nam: {
      type: DataTypes.INTEGER,
    },
    ID_Quy: {
      type: DataTypes.INTEGER,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
    },
    Image: {
      type: DataTypes.CHAR,
    },
    ID_User: {
      type: DataTypes.INTEGER,
    },
    Namsx: {
      type: DataTypes.INTEGER,
    },
    Nambdsd: {
      type: DataTypes.INTEGER,
    },
    Ghichu: {
      type: DataTypes.TEXT,
    },
    iTinhtrang: {
      type: DataTypes.INTEGER,
    },

    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Tb_TaisanQrCode",
  }
);

module.exports = Tb_TaisanQrCode;
