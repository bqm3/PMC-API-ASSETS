
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Taisan = sequelize.define("ent_taisan", {

  ID_Taisan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  ID_Nhomts: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ID_Donvi: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Mats: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  Tents: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  Thongso: {
    type: DataTypes.CHAR,
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
    tableName: 'Ent_Taisan'
  }
);

module.exports = Ent_Taisan;


