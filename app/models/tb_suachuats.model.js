const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_SuachuaTS = sequelize.define(
  "tb_suachuats",
  {
    ID_SuachuaTS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Ngaygiao: {
      type: DataTypes.DATE,
    },
    Sophieu: {
      type: DataTypes.CHAR,
    },
    Nguoitheodoi: {
      type: DataTypes.CHAR,
    },
    iTinhtrang: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Tb_SuachuaTS",
  }
);

module.exports = Tb_SuachuaTS;
