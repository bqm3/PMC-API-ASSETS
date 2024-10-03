const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

// Định nghĩa mô hình Tb_GiaonhanTS
const Ent_PhieuNCC = sequelize.define(
  "ent_phieuncc",
  {
    ID_PhieuNCC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Nghiepvu: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Loainhom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Sophieu: {
      type: DataTypes.CHAR,
    },
    ID_NoiNhap: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_NoiXuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_User: {
      type: DataTypes.INTEGER,
    },
    NgayNX: {
      type: DataTypes.DATE,
    },
    Ghichu: {
      type: DataTypes.TEXT,
    },
    ID_Nam: {
      type: DataTypes.INTEGER,
    },
    ID_Thang: {
      type: DataTypes.INTEGER,
    },
    iTinhtrang: {
      type: DataTypes.INTEGER,
    },
    ID_Quy: {
      type: DataTypes.INTEGER,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "Ent_PhieuNCC",
  }
);

module.exports = Ent_PhieuNCC;
