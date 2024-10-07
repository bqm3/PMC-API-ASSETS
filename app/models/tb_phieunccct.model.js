const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_PhieuNCCCT = sequelize.define(
  "tb_phieunccct",
  {
    ID_PhieuNCCCT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_TaisanQrCode: {
      type: DataTypes.INTEGER,
    },
    ID_PhieuNX: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Dongia: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Soluong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Chietkhau: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    timestamps: false,
    tableName: "Tb_PhieuNCCCT",
  }
);

module.exports = Tb_PhieuNCCCT;
