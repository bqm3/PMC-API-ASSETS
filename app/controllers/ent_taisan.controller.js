const entTaisanService = require("../services/ent_taisan.service");
const entNhomtsService = require("../services/ent_nhomts.service");

const createEnt_taisan = async (req, res) => {
  try {
    const { ID_Nhomts, ID_Donvi, Tents, Thongso, Ghichu, Nuocsx } = req.body;

    // Bước 1: Thêm bản ghi mới vào bảng ent_taisan mà không có Mats
    const reqData = {
      ID_Nhomts: ID_Nhomts || null,
      ID_Donvi: ID_Donvi || null,
      Mats: "",  // Mats sẽ được tạo sau
      Tents: Tents || "",
      Thongso: Thongso || "",
      Nuocsx: Nuocsx || "",
      Ghichu: Ghichu || "",
      isDelete: 0,
    };

    const newAsset = await entTaisanService.createEnt_taisan(reqData);

    if (!newAsset || !newAsset.ID_Taisan) {
      return res.status(500).json({ message: "Lỗi khi tạo tài sản mới" });
    }

    // Bước 2: Lấy MaNhom từ ent_nhomts sử dụng ID_Nhomts
    const nhomts = await entNhomtsService.getDetailEnt_taisan(ID_Nhomts);
    if (!nhomts || !nhomts.Manhom) {
      return res.status(500).json({ message: "Không tìm thấy MaNhom từ ID_Nhomts" });
    }

    const MaNhom = nhomts.Manhom;

    // Bước 3: Tạo giá trị Mats mới
    const Mats = `${MaNhom}000${newAsset.ID_Taisan}`;

    // Bước 4: Cập nhật Mats cho bản ghi vừa tạo
    const updatedAsset = await entTaisanService.updateleEnt_taisan({ Mats: Mats, ID_Taisan: newAsset.ID_Taisan });

    res.status(200).json({
      message: "Tạo thành công và cập nhật Mats",
      data: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getDetaileEnt_taisan = async(req, res) => {
  try {
    const ID_Taisan = req.params.id;
    const data = await entTaisanService.getDetailEnt_taisan(ID_Taisan);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAlleEnt_taisan = async (req, res) => {
  try {
    const data = await entTaisanService.getAlleEnt_taisan();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateleEnt_taisan = async (req, res) => {
  try {
    const { ID_Nhomts, ID_Donvi, Mats, Tents, Thongso, Ghichu, Nuocsx } = req.body;
    const ID_Taisan = req.params.id;

    // Bước 1: Kiểm tra chi tiết tài sản hiện tại
    const currentAsset = await entTaisanService.getDetailEnt_taisan(ID_Taisan);
    if (!currentAsset) {
      return res.status(404).json({ message: "Tài sản không tồn tại" });
    }

    // Bước 2: Xác định xem có cần cập nhật Mats hay không
    let updatedMats = Mats;
    if (ID_Nhomts && ID_Nhomts !== currentAsset.ID_Nhomts) {
      // Nếu ID_Nhomts thay đổi, cần tính lại Mats
      const nhomts = await entNhomtsService.getDetailEnt_taisan(ID_Nhomts);
      if (!nhomts || !nhomts.Manhom) {
        return res.status(500).json({ message: "Không tìm thấy MaNhom từ ID_Nhomts" });
      }

      const MaNhom = nhomts.Manhom;
      updatedMats = `${MaNhom}000${ID_Taisan}`;
    }

    // Bước 3: Cập nhật tài sản với thông tin mới
    await entTaisanService.updateleEnt_taisan({
      ID_Nhomts: ID_Nhomts || currentAsset.ID_Nhomts, // Giữ nguyên nếu không có thay đổi
      ID_Donvi: ID_Donvi || currentAsset.ID_Donvi, // Giữ nguyên nếu không có thay đổi
      Mats: updatedMats || currentAsset.Mats, // Cập nhật hoặc giữ nguyên Mats
      Tents: Tents || currentAsset.Tents, // Giữ nguyên nếu không có thay đổi
      Thongso: Thongso || currentAsset.Thongso, // Giữ nguyên nếu không có thay đổi
      Ghichu: Ghichu || currentAsset.Ghichu, // Giữ nguyên nếu không có thay đổi
      Nuocsx: Nuocsx || currentAsset.Nuocsx,
      ID_Taisan: ID_Taisan,
    });

    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteEnt_taisan = async (req, res) => {
  try {
    const ID_Taisan = req.params.id;
    await entTaisanService.deleteEnt_taisan(ID_Taisan);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_taisan,
  getDetaileEnt_taisan,
  getAlleEnt_taisan,
  updateleEnt_taisan,
  deleteEnt_taisan,
};
