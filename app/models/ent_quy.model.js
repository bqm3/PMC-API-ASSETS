
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Quy = sequelize.define("ent_quy", {
    
   ID_Quy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
   },
   Quy: {
     type: DataTypes.CHAR,
     allowNull: false,
   },
   isDelete: {
    type: DataTypes.INTEGER,
    defaultValue: 0
   },
},
 {
    freezeTableName: true,
    timestamps: false,
    tableName: 'Ent_Quy'
  }
);

module.exports = Ent_Quy;


