const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_Nghiepvu = sequelize.define(
  "ent_nghiepvu",
  {
    ID_Nghiepvu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Nghiepvu: {
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
    tableName: "Ent_Nghiepvu",
  }
);

module.exports = Ent_Nghiepvu;
