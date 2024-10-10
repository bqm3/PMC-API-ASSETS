const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Ent_NhansuPBDA = require("./ent_nhansupbda.model");

// Định nghĩa mô hình Tb_GiaonhanTS
const Tb_GiaonhanTS = sequelize.define(
  "tb_giaonhants",
  {
    ID_Giaonhan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Phongban: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Nam: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Quy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iGiaonhan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // iGiaonhan = 1 (Giao tài sản, CCDC cho nhân sự)
      // iGiaonhan = 2 (Nhận tài sản, CCDC từ nhân sự khi nhân sự điều chuyển dự án phòng ban hoặc nghỉ việc)
    },
    Nguoinhan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ent_NhansuPBDA,
        key: "ID_NSPB",
      },
    },
    Ngay: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Ghichu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Nguoigiao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ent_NhansuPBDA,
        key: "ID_NSPB",
      },
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "Tb_GiaonhanTS",
  }
);

module.exports = Tb_GiaonhanTS;
