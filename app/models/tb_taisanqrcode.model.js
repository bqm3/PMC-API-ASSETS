
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_TaisanQrCode = sequelize.define("tb_taisanqrcode", {

  ID_TaisanQrCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  ID_Taisan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
 
  MaQrCode: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  Ngaykhoitao: {
    type: DataTypes.DATE,
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
    tableName: 'tb_taisanqrcode'
  }
);

module.exports = Tb_TaisanQrCode;


