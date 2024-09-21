const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_NhansuPBDA = sequelize.define(
  "ent_nhansupbda",
  {
    ID_NSPB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
    },
    ID_Connguoi: {
      type: DataTypes.INTEGER,
    },
    Ngayvao: {
      type: DataTypes.DATE,
    },
    Ngay: {
      type: DataTypes.DATE,
    },
    iTinhtrang: {
      type: DataTypes.INTEGER,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "Ent_NhansuPBDA",
  }
);

module.exports = Ent_NhansuPBDA;
