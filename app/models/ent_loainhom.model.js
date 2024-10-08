const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Loainhom = sequelize.define(
  "ent_loainhom",
  {
    ID_Loainhom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Loainhom: {
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
    tableName: "Ent_Loainhom",
  }
);

module.exports = Ent_Loainhom;
