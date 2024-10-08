const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Connguoi = sequelize.define(
  "ent_connguoi",
  {
    ID_Connguoi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    MaPMC: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Hoten: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Gioitinh: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Diachi: {
      type: DataTypes.CHAR,
    },
    Sodienthoai: {
      type: DataTypes.CHAR,
    },
    NgayGhinhan: {
      type: DataTypes.DATE,
    },
    Ghichu: {
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
    tableName: "Ent_Connguoi",
  }
);

module.exports = Ent_Connguoi;
