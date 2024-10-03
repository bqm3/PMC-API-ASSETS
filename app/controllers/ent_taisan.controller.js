const entTaisanService = require("../services/ent_taisan.service");
const entNhomtsService = require("../services/ent_nhomts.service");
const {Tb_PhieuNXCT, Tb_SuachuaTS, Tb_SuachuaCT} = require("../models/setup.model");

const createEnt_taisan = async (req, res) => {
  try {
    const { ID_Nhomts, ID_Donvi, Tents, Thongso, Ghichu, Nuocsx, Tentscu, i_MaQrCode } = req.body;

    // Bước 1: Thêm bản ghi mới vào bảng ent_taisan mà không có Mats
    const reqData = {
      ID_Nhomts: ID_Nhomts || null,
      ID_Donvi: ID_Donvi || null,
      Tentscu: Tentscu || "",
      i_MaQrCode: i_MaQrCode || 0,
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
    const updatedAsset = await entTaisanService.updateEnt_taisan({ Mats: Mats, ID_Taisan: newAsset.ID_Taisan });

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

const getAllEnt_taisan = async (req, res) => {
  try {
    const data = await entTaisanService.getAllEnt_taisan();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_taisan = async (req, res) => {
  try {
    const { ID_Nhomts, ID_Donvi, Mats, Tents, Thongso, Ghichu, Nuocsx, Tentscu, i_MaQrCode } = req.body;
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

    // Bước 3: Check 
    // const roomExists = await entTaisanService.check_taisan(updatedMats, Tents, ID_Taisan);
    // if (roomExists) {
    //   return res.status(400).json({
    //     message: "Mã tài sản hoặc tên tài sản đã tồn tại. Vui lòng nhập lại thông tin.",
    //   });
    // }
    
    // Bước 4: Cập nhật tài sản với thông tin mới
    await entTaisanService.updateEnt_taisan({
      ID_Nhomts: ID_Nhomts || currentAsset.ID_Nhomts,
      ID_Donvi: ID_Donvi || currentAsset.ID_Donvi,
      Mats: updatedMats || currentAsset.Mats, 
      Tents: Tents || currentAsset.Tents,
      Thongso: Thongso || currentAsset.Thongso,
      Ghichu: Ghichu || currentAsset.Ghichu,
      Nuocsx: Nuocsx || currentAsset.Nuocsx,
      Tentscu: Tentscu || currentAsset.Tentscu,
      i_MaQrCode: i_MaQrCode || currentAsset.i_MaQrCode,
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

    const dataPhieuNXCT = await Tb_PhieuNXCT.findOne({
      attributes: [
        "ID_Taisan", "isDelete"
      ],
      where: {
        ID_Taisan,
        isDelete: 0
      }
    })

    const dataSuachuaTS = await Tb_SuachuaTS.findOne({
      attributes: [
        "ID_SuachuaTS", "ID_Phongban", "Ngaygiao", "Sophieu", "Nguoitheodoi", "iTinhtrang", "isDelete"
      ],
      include: [
        {
          model: Tb_SuachuaCT,
          as: "tb_suachuact",
          attributes: [
            "ID_PhieuSCCT", "ID_SuachuaTS", "ID_TaisanQr", "ID_Taisan", "Ngaynhan", "Sotien", "Ghichu", "isDelete"
          ],
          where: {
            ID_Taisan,
            isDelete: 0
          }
        }
      ],
      where: {
        isDelete: 0
      }
    })

    if(dataPhieuNXCT || dataSuachuaTS) {
      return  res.status(200).json({
        message: "Không thể xóa vì có liên quan đến phiếu hoặc sửa chữa!",
      });
    }

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
  getAllEnt_taisan,
  updateEnt_taisan,
  deleteEnt_taisan,
};
