const { Ent_Duan } = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_Duan = async (data) => {
  const find = await getDetail(data)
  if(find) {
    throw new Error(`Đã tồn tại hãng: ${data.Duan}`);
  }
  const res = await Ent_Duan.create(data);
  return res;
};

const getDetail = async (data, excludeId = null) => {
  try{
    const conditions = {
      isDelete: 0,
      Duan: sequelize.where(
        sequelize.fn(
          "UPPER",
          sequelize.fn("TRIM", sequelize.col("Duan"))
        ),
        "LIKE",
        data.Duan.trim().toUpperCase()
      ),
    };
    if(excludeId){
      conditions.ID_Duan = {
        [Op.ne]: excludeId 
      };
    }
    const find = await Ent_Duan.findOne({
      attributes: [
        "ID_Duan",
        "Duan",
        "isDelete",
      ],
      where: conditions,
    });
    return find;
  } catch (error) {
    throw new Error(error.message)
  }
}

const getAllEnt_Duan = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Duan.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_Duan = async (data) => {
  try {
    const find = await getDetail(data, data.ID_Duan)
    if(find){
      throw new Error(`Đã tồn tại hãng: ${data.Duan}`);
    } else {
      let whereClause = {
        isDelete: 0,
        ID_Duan: data.ID_Duan,
      };
    
      const res = await Ent_Duan.update(
        {
          Duan: data.Duan,
        },
        {
          where: whereClause,
        }
      );
      return res;
    }
  } catch (error){
    throw new Error(error.message)
  }
};

const deleteEnt_Duan = async (id) => {
  const res = await Ent_Duan.update(
    { isDelete: 1 },
    {
      where: {
        ID_Duan: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_Duan,
  getAllEnt_Duan,
  updateEnt_Duan,
  deleteEnt_Duan,
};
