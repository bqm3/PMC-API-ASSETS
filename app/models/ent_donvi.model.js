const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Donvi = sequelize.define(
  "ent_donvi",
  {
    ID_Donvi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Donvi: {
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
    tableName: "Ent_Donvi",
  }
);

module.exports = Ent_Donvi;
