const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_TaisanQrCode = sequelize.define(
  "tb_taisanqrcode",
  {
    ID_TaisanQr: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    MaQrCode: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Ngaykhoitao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Giatri: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    ID_Nam: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Thang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Connguoi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Ghichu: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    iTinhtrang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "Tb_TaisanQrCode",
  }
);

module.exports = Tb_TaisanQrCode;
