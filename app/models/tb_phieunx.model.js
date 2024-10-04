const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Ent_Phongbanda = require("./ent_phongbanda.model");

const Tb_PhieuNX = sequelize.define(
  "tb_phieunx",
  {
    ID_PhieuNX: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Nghiepvu: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_NoiNhap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ent_Phongbanda, // Tên bảng tham chiếu
        key: "ID_Phongban", // Khóa chính của bảng Ent_Phongbanda
      },
    },
    ID_NoiXuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ent_Phongbanda, // Tên bảng tham chiếu
        key: "ID_Phongban", // Khóa chính của bảng Ent_Phongbanda
      },
    },
    ID_Loainhom: {
      type: DataTypes.INTEGER,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
    },
    Sophieu: {
      type: DataTypes.CHAR,
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
    tableName: "Tb_PhieuNX",
  }
);

module.exports = Tb_PhieuNX;
