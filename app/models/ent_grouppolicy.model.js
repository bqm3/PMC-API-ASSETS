
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_GroupPolicy = sequelize.define("ent_grouppolicy", {
    
   ID_GroupPolicy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
   },
   GroupPolicy: {
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
    tableName: 'Ent_GroupPolicy'
  }
);

module.exports = Ent_GroupPolicy;


