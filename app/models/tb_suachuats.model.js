const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tb_SuachuaTS = sequelize.define(
  "tb_suachuats",
  {
    ID_Suachua: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Ngaygiao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Sophieu: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Nguoitheodoi: {
      type: DataTypes.CHAR,
      allowNull: false,
    },

    iIinhtrang: {
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
    tableName: "Tb_SuachuaTS",
  }
);

module.exports = Tb_SuachuaTS;
