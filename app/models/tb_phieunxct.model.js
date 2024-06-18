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
    
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "Tb_PhieuNXCT",
  }
);

module.exports = Tb_PhieuNXCT;
