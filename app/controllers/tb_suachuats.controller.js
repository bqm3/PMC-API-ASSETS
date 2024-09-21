
const entNhomtsService = require("../services/ent_nhomts.service");
const tbSuachuaTsService = require("../services/tb_suachuats.service");

const createTb_Suachuats = async (req, res) => {
  try {
    const { Ngaygiao, Sophieu, Nguoitheodoi, suachuact} = req.body;

    // Bước 1: Thêm bản ghi mới vào bảng Tb_Suachuats mà không có Mats
    const reqData = {
      Ngaygiao: Ngaygiao || new Date(),
      Sophieu: Sophieu || "",
      Nguoitheodoi: Nguoitheodoi || '',  // Mats sẽ được tạo sau
      iTinhtrang: 0,
      isDelete: 0,
    };

    if (!Array.isArray(suachuact) || suachuact.length === 0) {
      return res.status(400).json({
        message: "Danh sách chi tiết sửa chữa tài sản không được để trống.",
      });
    }

    const newAsset = await tbSuachuaTsService.getDetailTb_Suachuats(Sophieu);

    if (newAsset) {
      return res.status(500).json({ message: "Đã có mã số phiếu" });
    }

    const data = await tbSuachuaTsService.createTb_Suachuats(reqData);


     // Create Tb_PhieuNXCT
     await tbSuachuaTsService.createTb_Suachuact(suachuact, data);

    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getDetailTb_Suachuats = async(req, res) => {
  try {
    const ID_SuaChuaTs = req.params.id;
    const data = await tbSuachuaTsService.getDetailTb_Suachuats(ID_SuaChuaTs);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAllTb_Suachuats = async (req, res) => {
  try {
    const data = await tbSuachuaTsService.getAllTb_Suachuats();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTb_Suachuats = async (req, res) => {
  try {
    const { Ngaygiao, Sophieu, Nguoitheodoi, suachuact} = req.body;
    const ID_SuaChuaTs = req.params.id;
    
    const reqData = {
      ID_SuachuaTS: ID_SuaChuaTs,
      Ngaygiao: Ngaygiao || new Date(),
      Sophieu: Sophieu || "",
      Nguoitheodoi: Nguoitheodoi || '',  // Mats sẽ được tạo sau
      iTinhtrang: 0,
      isDelete: 0,
    };

    if (!Array.isArray(suachuact) || suachuact.length === 0) {
      return res.status(400).json({
        message: "Danh sách chi tiết sửa chữa tài sản không được để trống.",
      });
    }
  
    const data = await tbSuachuaTsService.updateTb_Suachuats(reqData);

     await tbSuachuaTsService.updateTb_Suachuact(suachuact, data);

    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const closeTb_Suachuats = async (req, res) => {
  try {
    const ID_SuaChuaTS = req.params.id;
    const data = await tbSuachuaTsService.closeTb_SuachuaTs(ID_SuaChuaTS);

    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTb_Suachuats = async (req, res) => {
  try {
    const ID_SuaChuaTS = req.params.id;
    await tbSuachuaTsService.deleteTb_Suachuats(ID_SuaChuaTS);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTb_Suachuats,
  getDetailTb_Suachuats,
  getAllTb_Suachuats,
  updateTb_Suachuats,
  deleteTb_Suachuats,
  closeTb_Suachuats
};
