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
      allowNull: false,
    },
    Ngaynhan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Sotien: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Ghichu: {
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
    tableName: "Tb_SuachuaCT",
  }
);

module.exports = Tb_SuachuaCT;
