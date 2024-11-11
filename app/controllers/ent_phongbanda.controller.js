const entPhongbandaService = require("../services/ent_phongbanda.service");
const { removeVietnameseTones } = require("../utils/utils");

const createEnt_phongbanda = async (req, res) => {
  try {
    const { ID_Chinhanh, ID_Nhompb, Mapb, ID_Duan, Tenphongban, Diachi, Ghichu, Thuoc } =
      req.body;

    const reqData = {
      ID_Chinhanh: ID_Chinhanh || null,
      ID_Duan: ID_Duan || null,
      ID_Nhompb: ID_Nhompb || null,
      Mapb: Mapb || "",
      Tenphongban: Tenphongban || "",
      Thuoc: Thuoc || "",
      Diachi: Diachi || "",
      Ghichu: Ghichu || "",
      isDelete: 0,
    };

    const roomExists = await entPhongbandaService.check_phongbanda(
      Mapb,
      Tenphongban,
      Thuoc
    );
    if (roomExists) {
      let conflictDetails = [];
      if (
        removeVietnameseTones(roomExists.Mapb) == removeVietnameseTones(Mapb)
      ) {
        conflictDetails.push(`mã phòng ban: ${Mapb}`);
      }
      if (
        removeVietnameseTones(roomExists.Tenphongban) ==
        removeVietnameseTones(Tenphongban)
      ) {
        conflictDetails.push(`tên phong ban: ${Tenphongban}`);
      }
      res.status(400).json({
        message: `Đã có phòng ban dự án thuộc ${Thuoc} tồn tại với ${conflictDetails.join(
          ", "
        )}. Vui lòng kiểm tra lại.`,
      });
    } else {
      const data = await entPhongbandaService.createEnt_phongbanda(reqData);
      res.status(200).json({
        message: "Tạo thành công",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetaileEnt_phongbanda = async (req, res) => {
  try {
    const ID_Phongban = req.params.id;
    const data = await entPhongbandaService.getDetailEnt_phongbanda(
      ID_Phongban
    );
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_phongbanda = async (req, res) => {
  try {
    const data = await entPhongbandaService.getAllEnt_phongbanda();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_phongbanda = async (req, res) => {
  try {
    const { ID_Nhompb, ID_Chinhanh, Mapb, ID_Duan, Tenphongban, Diachi, Ghichu, Thuoc } =
      req.body;
    const ID_Phongban = req.params.id;

    const roomExists = await entPhongbandaService.check_phongbanda(
      Mapb,
      Tenphongban,
      Thuoc,
      ID_Phongban
    );
    if (roomExists) {
      let conflictDetails = [];
      if (
        removeVietnameseTones(roomExists.Mapb) == removeVietnameseTones(Mapb)
      ) {
        conflictDetails.push(`mã phòng ban: ${Mapb}`);
      }
      if (
        removeVietnameseTones(roomExists.Tenphongban) ==
        removeVietnameseTones(Tenphongban)
      ) {
        conflictDetails.push(`tên phong ban: ${Tenphongban}`);
      }
      res.status(400).json({
        message: `Đã có phòng ban dự án thuộc ${Thuoc} tồn tại với ${conflictDetails.join(
          ", "
        )}. Vui lòng kiểm tra lại.`,
      });
    } else {
      await entPhongbandaService.updateEnt_phongbanda({
        ID_Phongban: ID_Phongban,
        ID_Chinhanh: ID_Chinhanh || null,
        ID_Nhompb: ID_Nhompb || null,
        ID_Duan: ID_Duan || null,
        Thuoc: Thuoc || "",
        Mapb: Mapb || "",
        Tenphongban: Tenphongban || "",
        Diachi: Diachi || "",
        Ghichu: Ghichu || "",
        isDelete: 0,
      });
      res.status(200).json({
        message: "Cập nhật thành công",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_phongbanda = async (req, res) => {
  try {
    const ID_Phongban = req.params.id;
    await entPhongbandaService.deleteEnt_phongbanda(ID_Phongban);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_phongbanda,
  getDetaileEnt_phongbanda,
  getAllEnt_phongbanda,
  updateEnt_phongbanda,
  deleteEnt_phongbanda,
};
