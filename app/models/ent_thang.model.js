
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Thang = sequelize.define("ent_thang", {
    
   ID_Thang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
   },
   Thang: {
     type: DataTypes.CHAR,
     allowNull: false,
   },
   iThang: {
    type: DataTypes.INTEGER,
   },
},
 {
    freezeTableName: true,
    timestamps: false,
    tableName: 'Ent_Thang'
  }
);

module.exports = Ent_Thang;


