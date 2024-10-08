const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_SuachuaCT = sequelize.define(
  "tb_suachuact",
  {
    ID_PhieuSCCT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_SuachuaTS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_TaisanQr: {
      type: DataTypes.INTEGER,
    },
    ID_Taisan: {
      type: DataTypes.INTEGER,
    },
    Ngaynhan: {
      type: DataTypes.DATE,
    },
    Sotien: {
      type: DataTypes.DOUBLE,
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
    tableName: "Tb_SuachuaCT",
  }
);

module.exports = Tb_SuachuaCT;
