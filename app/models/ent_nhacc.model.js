const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Nhacc = sequelize.define(
  "ent_nhacc",
  {
    ID_Nhacc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    MaNhacc: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    TenNhacc: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Masothue: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Sodienthoai: {
      type: DataTypes.CHAR,
    },
    Sotaikhoan: {
      type: DataTypes.CHAR,
    },
    Nganhang: {
      type: DataTypes.CHAR,
    },
    Diachi: {
      type: DataTypes.CHAR,
    },
    Ghichu: {
      type: DataTypes.CHAR,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Ent_Nhacc",
  }
);

module.exports = Ent_Nhacc;
