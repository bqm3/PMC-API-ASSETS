const eThangService = require("../services/ent_thang.service");
const eNamService = require("../services/ent_nam.service");



exports.createGiaoNhanTS = async (req, res) => {
    try {
      const user = req.user.data;
      const {
        ID_Phongban,
        iGiaonhan,
        Nguoinhan,
        Ngay,
        ID_Quy,
        Ghichu,
        Nguoigiao,
        giaonhants
      } = req.body;
  
      const Nam = await eNamService.getDetail(Ngay);
  
      const reqData = {
        ID_Phongban: ID_Phongban,
        Nguoinhan: Nguoinhan,
        Ghichu: Ghichu,
        ID_Nam: Nam.ID_Nam,
        ID_Quy: ID_Quy,
        Nguoigiao: Nguoigiao,
        iGiaonhan: iGiaonhan,
        giaonhants: giaonhants,
        isDelete: 0,
      };

      // Từ ID_Quy, ID_Nam, ID_Phongban, ID_Taisan, So luong từ giaonhants[ID_Taisan]
      // =>  so sánh với bảng Tb_Tonkho
      // ====================================

  
      const checkPhieuNX = await Tb_PhieuNX.findOne({
        attributes: ["ID_Nghiepvu", "Sophieu", "ID_NoiNhap", "ID_NoiXuat", "iTinhtrang", "isDelete", "ID_Nam", "ID_Quy", "isDelete"],
        where: {
          [Op.or]: [
            {
              ID_Nam: Nam.ID_Nam,
              ID_Quy: ID_Quy,
              ID_Nghiepvu: ID_Nghiepvu,
              ID_NoiNhap: ID_NoiNhap,
              ID_NoiXuat: ID_NoiXuat,
              isDelete: 0,
            },
            {
              Sophieu: {
                [Op.like]: `%${Sophieu}%`
              }
            }
          ]
        }
      })
    
      if(checkPhieuNX) {
        return  res.status(400).json({
          message: "Đã có phiếu tồn tại",
        });
      }
  
      let data;
  
      // Create Tb_PhieuNX
      data = await tbPhieuNXService.createTb_PhieuNX(reqData);
  
      // Create Tb_PhieuNXCT
      if (
        phieunxct &&
        Array.isArray(phieunxct) &&
        phieunxct.length > 0 &&
        phieunxct[0]?.ID_Taisan !== null
      ) {
        await tbPhieuNXCTService.createTb_PhieuNXCT(phieunxct, data);
      }
  
      // Send success response
      res.status(200).json({
        message: "Tạo thành công",
        data: data,
      });
    } catch (error) {
      // Handle errors
      console.error("Error in creating Tb_PhieuNX:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi khi tạo phiếu nhập xuất" });
    }
  };



  ///
  // Đầu vào sẽ có ID_Phongbanduan => Kiểm tra xem Phòng ban xuất tài sản 
  // B1: Có ID_Phongban xuất, danh sách ID_Taisan (Bỏ qua năm, đơn giá)
  // B2: Quét qr code lấy dc ID_Taisan lấy từ bảng tb_taisanqrcode
  // B3: trả về thông tin tài sản + thông tin tb_táianqrcode
  // B4: Từ ID_TaisanQrcode 

  // B2: Nhập tài sản điều chuyển. Với ts có mã qr code thì phải quét.
  // Nhập tay phần mã qrcode ( 1 bản ghi tài sản)

  // Chọn tài sản nếu k có qr code( 1-> n)

  // B3: Tb_NXCT tìm kiếm trong tb_tonkho số lượng tồn sổ sách của tài sản theo
  // dự án ( nơi xuaast, năm, quý, ID_Taisan)

  // B4: Cập nhât vào bảng TB-Tonkho trường ID_NOIXUAT , XUATNOI = XUATNOIBO + SL
