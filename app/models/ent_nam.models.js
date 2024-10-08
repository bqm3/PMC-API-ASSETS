const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Nam = sequelize.define(
  "ent_nam",
  {
    ID_Nam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Nam: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Giatri: {
      type: DataTypes.CHAR,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Ent_Nam",
  }
);

module.exports = Ent_Nam;
