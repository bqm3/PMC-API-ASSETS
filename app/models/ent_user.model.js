const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_User = sequelize.define(
  "ent_user",
  {
    ID_User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Nhompb: {
      type: DataTypes.INTEGER,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
    },
    ID_Chinhanh: {
      type: DataTypes.INTEGER,
    },
    ID_Chucvu: {
      type: DataTypes.INTEGER,
    },
    ID_Policy: {
      type: DataTypes.JSON,
    },
    IDNHOMNGUOIDUNG: {
      type: DataTypes.JSON,
    },
    MaPMC: {
      type: DataTypes.CHAR,
    },
    Hoten: {
      type: DataTypes.CHAR,
    },
    Gioitinh: {
      type: DataTypes.CHAR,
    },
    Diachi: {
      type: DataTypes.CHAR,
    },
    Sodienthoai: {
      type: DataTypes.CHAR,
    },
    Emails: {
      type: DataTypes.CHAR,
    },
    Password: {
      type: DataTypes.CHAR,
    },
    Anh: {
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
    tableName: "Ent_User",
  }
);

module.exports = Ent_User;
