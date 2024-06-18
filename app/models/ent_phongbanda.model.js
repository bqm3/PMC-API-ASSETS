
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Phongbanda = sequelize.define("ent_phongbanda", {
    
   ID_Phongban: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
   },
   ID_Chinhanh: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   ID_Nhompb: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   Mapb: {
     type: DataTypes.CHAR,
     allowNull: false,
   },
   Tenphongban: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  Diachi: {
    type: DataTypes.CHAR,
    allowNull: false,
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
    timestamps: false,
    tableName: 'Ent_PhongbanDa'
  }
);

module.exports = Ent_Phongbanda;


