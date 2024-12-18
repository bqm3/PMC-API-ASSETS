const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_PhieuNXCT = sequelize.define(
  "tb_phieunxct",
  {
    ID_PhieuNXCT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_PhieuNX: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_TaisanQrcode: {
      type: DataTypes.INTEGER,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    Dongia: {
      type: DataTypes.DOUBLE,
    },
    Soluong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Chietkhau: {
      type: DataTypes.INTEGER,
    },
    Namsx: {
      type: DataTypes.INTEGER,
    },
    Anhts: {
      type: DataTypes.TEXT,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Tb_PhieuNXCT",
  }
);

module.exports = Tb_PhieuNXCT;
