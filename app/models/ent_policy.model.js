const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Policy = sequelize.define(
  "ent_policy",
  {
    ID_Policy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Policy: {
      type: DataTypes.CHAR,
    },

    ID_GroupPolicy: {
      type: DataTypes.INTEGER,
    },
    GroupPolicy: {
      type: DataTypes.CHAR,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Ent_Policy",
  }
);

module.exports = Ent_Policy;
