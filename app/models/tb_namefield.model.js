const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_NameField = sequelize.define(
  "tb_namefield",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Table: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NameField: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Descriptions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    SerialNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Parent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
    NameFieldParent: {
      type: DataTypes.CHAR,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "Tb_NameField",
  }
);

module.exports = Tb_NameField;
