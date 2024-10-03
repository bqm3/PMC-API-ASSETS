const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_GiaonhanTSCT = sequelize.define(
  "tb_giaonhantsct",
  {
    ID_Giaonhantsct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Giaonhan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_TaisanQrcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Tinhtrangmay: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Cactllienquan: {
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
    timestamps: false,
    tableName: "Tb_GiaonhanTSCT",
  }
);

module.exports = Tb_GiaonhanTSCT;
