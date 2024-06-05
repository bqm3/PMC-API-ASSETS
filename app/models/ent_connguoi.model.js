
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Connguoi = sequelize.define("ent_connguoi", {
    
   ID_Connguoi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
   },
   ID_Nhompb: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    allowNull: false,
  },
  Sodienthoai: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  Ghichu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  MaPMC: {
    type: DataTypes.CHAR,
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
    tableName: 'ent_connguoi'
  }
);

module.exports = Ent_Connguoi;


