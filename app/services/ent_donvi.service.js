const { Ent_Donvi } = require("../models/setup.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const createEnt_donvi = async (data) => {
  const find = await getDetail(data)
  if(find) {
    throw new Error(`Đã tồn tại đơn vị: ${data.Donvi}`);
  }
  const res = await Ent_Donvi.create(data);
  return res;
};

const getDetail = async (data, excludeId = null) => {
  try{
    const conditions = {
      isDelete: 0,
      Donvi: sequelize.where(
        sequelize.fn(
          "UPPER",
          sequelize.fn("TRIM", sequelize.col("Donvi"))
        ),
        "LIKE",
        data.Donvi.trim().toUpperCase()
      ),
    };
    if(excludeId){
      conditions.ID_Donvi = {
        [Op.ne]: excludeId 
      };
    }
    const find = await Ent_Donvi.findOne({
      attributes: [
        "ID_Donvi",
        "Donvi",
        "isDelete",
      ],
      where: conditions,
    });
    return find;
  } catch (error) {
    throw new Error(error.message)
  }
}

const getAllEnt_donvi = async () => {
  let whereClause = {
    isDelete: 0,
  };

  const res = await Ent_Donvi.findAll({
    where: whereClause,
  });
  return res;
};

const updateEnt_donvi = async (data) => {
  try {
    const find = await getDetail(data, data.ID_Donvi)
    if(find){
      throw new Error(`Đã tồn tại đơn vị: ${data.Donvi}`);
    } else {
      let whereClause = {
        isDelete: 0,
        ID_Donvi: data.ID_Donvi,
      };
    
      const res = await Ent_Donvi.update(
        {
          Donvi: data.Donvi,
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

const deleteEnt_donvi = async (id) => {
  const res = await Ent_Donvi.update(
    { isDelete: 1 },
    {
      where: {
        ID_Donvi: id,
      },
    }
  );
  return res;
};

module.exports = {
  createEnt_donvi,
  getAllEnt_donvi,
  updateEnt_donvi,
  deleteEnt_donvi,
};
