const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_Table = sequelize.define(
  "tb_table",
  {
    ID_Table: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_GroupPolicy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NameTable: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Descriptions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    iDisplay: {
      type: DataTypes.INTEGER,
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
    tableName: "Tb_Table",
  }
);

module.exports = Tb_Table;
