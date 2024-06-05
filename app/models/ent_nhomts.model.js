
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Nhomts = sequelize.define("ent_nhomts", {
    
   ID_Nhomts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
   },
   Manhom: {
     type: DataTypes.CHAR,
     allowNull: false,
   },
   Loaits: {
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
    tableName: 'Ent_Nhomts'
  }
);

module.exports = Ent_Nhomts;


