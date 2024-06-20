
const entNhomtsService = require("../services/ent_nhomts.service");
const tbSuachuaTsService = require("../services/tb_suachuats.service");

const createTb_Suachuats = async (req, res) => {
  try {
    const { Ngaytao, Sophieu, Nguoitheodoi, iTinhtrang } = req.body;

    // Bước 1: Thêm bản ghi mới vào bảng Tb_Suachuats mà không có Mats
    const reqData = {
      Ngaytao: Ngaytao || new Date,
      Sophieu: Sophieu || null,
      Nguoitheodoi: Nguoitheodoi || '',  // Mats sẽ được tạo sau
      iTinhtrang: iTinhtrang || "",
      isDelete: 0,
    };

    const newAsset = await tbSuachuaTsService.getDetailTb_Suachuats(Sophieu);

    if (!newAsset || !newAsset.ID_Suachua) {
      return res.status(500).json({ message: "Đã có mã số phiếu" });
    }

    const data = await tbSuachuaTsService.createTb_Suachuats(reqData);

    res.status(200).json({
      message: "Tạo thành công và cập nhật Mats",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getDetailTb_Suachuats = async(req, res) => {
  try {
    const ID_Taisan = req.params.id;
    const data = await tbSuachuaTsService.getDetailTb_Suachuats(ID_Taisan);
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

const updateleTb_Suachuats = async (req, res) => {
  try {
    const { ID_Nhomts, ID_Donvi, Mats, Tents, Thongso, Ghichu } = req.body;
    const ID_Taisan = req.params.id;

    // Bước 1: Kiểm tra chi tiết tài sản hiện tại
    const currentAsset = await tbSuachuaTsService.getDetailTb_Suachuats(ID_Taisan);
    if (!currentAsset) {
      return res.status(404).json({ message: "Tài sản không tồn tại" });
    }

    // Bước 2: Xác định xem có cần cập nhật Mats hay không
    let updatedMats = Mats;
    if (ID_Nhomts && ID_Nhomts !== currentAsset.ID_Nhomts) {
      // Nếu ID_Nhomts thay đổi, cần tính lại Mats
      const nhomts = await entNhomtsService.getDetailTb_Suachuats(ID_Nhomts);
      if (!nhomts || !nhomts.Manhom) {
        return res.status(500).json({ message: "Không tìm thấy MaNhom từ ID_Nhomts" });
      }

      const MaNhom = nhomts.Manhom;
      updatedMats = `${MaNhom}000${ID_Taisan}`;
    }

    // Bước 3: Cập nhật tài sản với thông tin mới
    await entTaisanService.updateleTb_Suachuats({
      ID_Nhomts: ID_Nhomts || currentAsset.ID_Nhomts, // Giữ nguyên nếu không có thay đổi
      ID_Donvi: ID_Donvi || currentAsset.ID_Donvi, // Giữ nguyên nếu không có thay đổi
      Mats: updatedMats || currentAsset.Mats, // Cập nhật hoặc giữ nguyên Mats
      Tents: Tents || currentAsset.Tents, // Giữ nguyên nếu không có thay đổi
      Thongso: Thongso || currentAsset.Thongso, // Giữ nguyên nếu không có thay đổi
      Ghichu: Ghichu || currentAsset.Ghichu, // Giữ nguyên nếu không có thay đổi
      ID_Taisan: ID_Taisan,
    });

    res.status(200).json({
      message: "Cập nhật thành công",
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
  updateleTb_Suachuats,
  deleteTb_Suachuats,
};
