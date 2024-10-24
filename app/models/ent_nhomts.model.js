const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Nhomts = sequelize.define(
  "ent_nhomts",
  {
    ID_Nhomts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Loainhom: {
      type: DataTypes.INTEGER,
    },
    Manhom: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Tennhom: {
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
    timestamps: true,
    tableName: "Ent_Nhomts",
  }
);

module.exports = Ent_Nhomts;
