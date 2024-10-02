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
      allowNull: false,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Thang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Quy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Tondau: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Tientondau: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Nhapngoai: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Tiennhapngoai: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    NhapNB: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Nhapkhac: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    XuatNB: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    XuattraNCC: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    XuatgiaoNV: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    XuatThanhly: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    XuatHuy: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    TonSosach: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Kiemke: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Giatb: {
      type: DataTypes.DOUBLE,
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
    tableName: "Tb_Tonkho",
  }
);

module.exports = Tb_Tonkho;
