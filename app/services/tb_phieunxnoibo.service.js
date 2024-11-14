const { uploadFile } = require("../middleware/image.middleware");
const {
  Ent_GroupPolicy,
  Tb_PhieuNXCT,
  Ent_Nghiepvu,
  Ent_Nam,
  Ent_Thang,
  Ent_Connguoi,
  Ent_Nhompb,
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhomts,
  Ent_Taisan,
  Tb_PhieuNX,
  Tb_Tonkho,
  Tb_TaisanQrCode,
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");
const { createQrCode } = require("./create_qr_code.service");

const createTb_PhieuNXNBCT = async (phieunxct, data) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Gom nhóm và chuẩn bị dữ liệu
    const groupedItems = phieunxct.reduce((acc, item) => {
      const { ID_Taisan, ID_TaisanQrcode, Soluong } = item;
      if (!acc[ID_Taisan]) {
        acc[ID_Taisan] = {
          ID_Taisan,
          ID_TaisanQrcode,
          Soluong,
          originalItems: [item],
        };
      } else {
        acc[ID_Taisan].Soluong += Soluong;
        acc[ID_Taisan].originalItems.push(item);
      }
      return acc;
    }, {});

    // 2. Lấy tất cả ID_TaisanQrcode không null
    const qrCodeIds = phieunxct
      .filter((item) => item.ID_TaisanQrcode)
      .map((item) => item.ID_TaisanQrcode);

    if (qrCodeIds.length > 0) {
      // 3. Kiểm tra điều kiện một lần cho tất cả QR codes
      const [existingNXCTs, existingQrCodes] = await Promise.all([
        Tb_PhieuNXCT.findAll({
          where: {
            ID_TaisanQrcode: { [Op.in]: qrCodeIds },
            isDelete: 0,
          },
          attributes: ["ID_TaisanQrcode"],
          transaction,
        }),
        Tb_TaisanQrCode.findAll({
          where: {
            ID_TaisanQrcode: { [Op.in]: qrCodeIds },
            ID_User: { [Op.not]: null },
          },
          attributes: ["ID_TaisanQrcode", "ID_User"],
          transaction,
        }),
      ]);

      // Kiểm tra điều kiện
      if (existingNXCTs.length > 0) {
        const existingQrCode = existingNXCTs[0];
        throw new Error(
          `Đã nhập tài sản có mã Qrcode ${existingQrCode.ID_TaisanQrcode}`
        );
      }

      if (existingQrCodes.length > 0) {
        const userAssignedQr = existingQrCodes[0];
        throw new Error(
          `Tài sản này đã giao cho user có ID: ${userAssignedQr.ID_User}`
        );
      }

      // 4. Cập nhật trạng thái QR codes một lần
      await Tb_TaisanQrCode.update(
        { iTinhtrang: 1, isDelete: 1 },
        {
          where: {
            ID_TaisanQrcode: { [Op.in]: qrCodeIds },
            isDelete: 0,
          },
          transaction,
        }
      );
    }

    // 5. Tạo tất cả bản ghi PhieuNXCT trong một lệnh
    const nxctRecords = phieunxct.map((item) => ({
      ID_Taisan: item.ID_Taisan,
      ID_TaisanQrcode: item.ID_TaisanQrcode,
      Soluong: item.Soluong,
      ID_PhieuNX: data.ID_PhieuNX,
      Dongia: item.Dongia || 0,
      Namsx: item.Namsx || null,
      isDelete: 0,
    }));

    const createdNXCTs = await Tb_PhieuNXCT.bulkCreate(nxctRecords, {
      transaction,
      returning: true,
    });

    // 6. Tạo QR codes song song
    await Promise.all(
      createdNXCTs.map((nxct) => createQrCode(nxct, data, transaction))
    );

    // 7. Cập nhật Tonkho
    const updatePromises = Object.values(groupedItems).map(async (item) => {
      const [xuatResult, nhapResult] = await Promise.all([
        // Cập nhật xuất
        Tb_Tonkho.update(
          {
            XuatNB: Sequelize.literal(`XuatNB + ${item.Soluong}`),
            TonSosach: Sequelize.literal(
              `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
            ),
          },
          {
            where: {
              ID_Taisan: item.ID_Taisan,
              Namsx: item.Namsx,
              ID_Phongban: data.ID_NoiXuat,
              TonSosach: { [Op.gte]: item.Soluong },
              ID_Nam: data.ID_Nam,
              ID_Quy: data.ID_Quy,
              isDelete: 0,
            },
            transaction,
          }
        ),
        // Cập nhật nhập
        Tb_Tonkho.findOrCreate({
          where: {
            ID_Taisan: item.ID_Taisan,
            Namsx: item.Namsx,
            ID_Phongban: data.ID_NoiNhap,
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
          },
          defaults: {
            ID_Thang: data.ID_Thang,
            NhapNB: item.Soluong,
            TonSosach: Sequelize.literal(
              `Tondau + Nhapngoai + Nhapkhac + ${item.Soluong} - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
            ),
          },
          transaction,
        }).then(([record, created]) => {
          if (!created) {
            return record.update(
              {
                NhapNB: Sequelize.literal(`NhapNB + ${item.Soluong}`),
                TonSosach: Sequelize.literal(
                  `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
                ),
              },
              { transaction }
            );
          }
        }),
      ]);

      if (xuatResult[0] === 0) {
        throw new Error(
          `Số lượng không hợp lệ cho tài sản: ${
            item.originalItems[0].Tents || item.ID_Taisan
          }`
        );
      }
    });

    await Promise.all(updatePromises);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const update_PhieuNXNB = async (phieunxct, data) => {
  const transaction = await sequelize.transaction();
  try {
    const updatedAndCreated = phieunxct.filter(
      (item) => item.isUpdate === 1 && item.isDelete === 0
    );
    const deleted = phieunxct.filter(
      (item) => item.isUpdate === 1 && item.isDelete === 1
    );

    const existingPhieuNXCTts = await Tb_PhieuNXCT.findAll({
      where: {
        ID_PhieuNX: data.ID_PhieuNX,
        isDelete: 0,
      },
      transaction,
    });

    // Sử dụng Set để kiểm tra sự tồn tại nhanh hơn
    const existingIDs = new Set(
      existingPhieuNXCTts.map((item) => item.ID_Taisan && item?.ID_TaisanQrcode)
    );

    // tạo và cập nhật
    const create = updatedAndCreated.filter(
      (item) => !existingIDs.has(item.ID_Taisan && item?.ID_TaisanQrcode)
    );
    const update = updatedAndCreated.filter((item) =>
      existingIDs.has(item.ID_Taisan && item?.ID_TaisanQrcode)
    );

    // tạo
    if (create.length > 0 && create[0].ID_Taisan != null) {
      await createTb_PhieuNXNBCT(create, data);
    }

    // cập nhật
    await Promise.all(
      update.map(async (item) => {
        const existingItem = existingPhieuNXCTts.find(
          (existing) => existing.ID_Taisan === item.ID_Taisan
        );
        if (existingItem) {
          const delta = item.Soluong - existingItem.Soluong;
          await Tb_PhieuNXCT.update(
            { Soluong: item.Soluong, isDelete: 0 },
            { where: { ID_PhieuNXCT: existingItem.ID_PhieuNXCT }, transaction }
          );
          await updateTonKho(item, delta, data, 0, transaction);
          await updateTonKho(item, delta, data, 1, transaction);
        }
      })
    );

    // xóa
    if (deleted.length > 0) {
      await Promise.all(
        deleted.map(async (item) => {
          await Tb_PhieuNXCT.update(
            { isDelete: 1 },
            { where: { ID_PhieuNXCT: item.ID_PhieuNXCT }, transaction }
          );
          await updateTonKho(item, -item.Soluong, data, 0, transaction);
          await updateTonKho(item, -item.Soluong, data, 1, transaction);
          await Tb_TaisanQrCode.update(
            { isDelete: 1 },
            { where: { ID_PhieuNXCT: item.ID_PhieuNXCT } }
          );
          await Tb_TaisanQrCode.update(
            { isDelete: 0, iTinhtrang: 0 },
            { where: { ID_TaisanQrcode: item.ID_TaisanQrcode } }
          );
        })
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Lỗi khi cập nhật Tb_PhieuNCCCT:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi cập nhật phiếu NCCCT.");
  }
};

const updateTonKho = async (item, delta, data, isCheck, transaction) => {
  let tonkho = {};

  if (isCheck === 0) {
    tonkho = {
      XuatNB: Sequelize.literal(`XuatNB + ${delta}`),
      TonSosach: Sequelize.literal(
        `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
      ),
    };
  } else {
    tonkho = {
      NhapNB: Sequelize.literal(`NhapNB + ${delta}`),
      TonSosach: Sequelize.literal(
        `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
      ),
    };
  }

  await Tb_Tonkho.update(tonkho, {
    where: {
      ID_Taisan: item.ID_Taisan,
      Namsx: item.Namsx,
      ID_Phongban: isCheck === 0 ? data.ID_NoiXuat : data.ID_NoiNhap,
      ID_Nam: data.ID_Nam,
      ID_Quy: data.ID_Quy,
      isDelete: 0,
    },
    transaction,
  });
};

const delete_PhieuNXNB = async (ID_PhieuNX, transaction) => {
  try {
    
    const data = await Tb_PhieuNX.findByPk(
      ID_PhieuNX,{transaction}
    )

    const phieuNXNB = await Tb_PhieuNXCT.findAll({
      attributes: ['ID_PhieuNXCT','ID_Taisan', 'ID_TaisanQrcode', 'Soluong'],
      where: {
        ID_PhieuNX,
        isDelete: 0,
      },
      raw: true,
      transaction
    });

    if (!phieuNXNB.length) {
      return;
    }

    const phieuNXCTIds = phieuNXNB.map(item => item.ID_PhieuNXCT);
    const taisanQrcodeIds = phieuNXNB
      .filter(item => item.ID_TaisanQrcode)
      .map(item => item.ID_TaisanQrcode);

    // // Xử lý các tác vụ đồng thời
    await Promise.all([
      Tb_PhieuNXCT.update(
        { isDelete: 1 },
        {
          where: { 
            ID_PhieuNX,
            isDelete: 0 
          },
          transaction 
        }
      ),
      ...(taisanQrcodeIds.length > 0 ? [
        Tb_TaisanQrCode.update(
          { isDelete: 1 },
          {
            where: { ID_PhieuNXCT: phieuNXCTIds },
            transaction
          }
        ),
        Tb_TaisanQrCode.update(
          { isDelete: 0, iTinhtrang: 0 },
          {
            where: { ID_TaisanQrcode: taisanQrcodeIds },
            transaction
          }
        )
      ] : []),
      // Cập nhật tồn kho cho từng item
      ...phieuNXNB.map(item =>
        Promise.all([
          updateTonKho(item, -item.Soluong, data, 0, transaction),
          updateTonKho(item, -item.Soluong, data, 1, transaction)
        ])
      )
    ]);
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createTb_PhieuNXNBCT,
  update_PhieuNXNB,
  delete_PhieuNXNB,
};
