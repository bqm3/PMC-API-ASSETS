const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

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
    },
    ID_NoiXuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Sophieu: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    ID_Connguoi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NgayNX: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Ghichu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ID_Nam: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Thang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iTinhtrang: {
      type: DataTypes.INTEGER,
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
    tableName: "Tb_PhieuNX",
  }
);

module.exports = Tb_PhieuNX;
