const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_Tonkho = sequelize.define(
  "tb_tonkho",
  {
    ID_Tonkho: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Nam: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ID_Thang: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ID_Quy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Tondau: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Tientondau: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Nhapngoai: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Tiennhapngoai: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    NhapNB: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Nhapkhac: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    XuatNB: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    XuattraNCC: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    XuatgiaoNV: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    XuatThanhly: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    XuatHuy: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    TonSosach: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Kiemke: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Giatb: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Tb_Tonkho",
  }
);

module.exports = Tb_Tonkho;
