const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Taisan = sequelize.define(
  "ent_taisan",
  {
    ID_Taisan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Nhomts: {
      type: DataTypes.INTEGER,
    },
    ID_Donvi: {
      type: DataTypes.INTEGER,
    },
    Mats: {
      type: DataTypes.CHAR,
    },
    Tents: {
      type: DataTypes.CHAR,
    },
    Tentscu: {
      type: DataTypes.CHAR,
    },
    Model: {
      type: DataTypes.CHAR,
    },
    SerialNumber: {
      type: DataTypes.CHAR,
    },
    Thongso: {
      type: DataTypes.CHAR,
    },
    Nuocsx: {
      type: DataTypes.CHAR,
    },
    i_MaQrCode: {
      type: DataTypes.INTEGER,
    },
    Ghichu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Ent_Taisan",
  }
);

module.exports = Ent_Taisan;
