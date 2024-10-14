const { uploadFile } = require("../middleware/image.middleware");
const {
  Ent_GroupPolicy,
  Tb_PhieuNCCCT,
  Ent_Nghiepvu,
  Ent_Nam,
  Ent_Thang,
  Ent_Connguoi,
  Ent_Nhompb,
  Ent_Phongbanda,
  Ent_Chinhanh,
  Ent_Nhomts,
  Ent_Taisan,
  Tb_Tonkho,
  Tb_TaisanQrCode,
  Tb_PhieuNX,
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");
const formatDateTime = require("../utils/formatDatetime");

const createTb_PhieuNXTNCC = async (phieunxct, data) => {
  const groupedItems = {};
  const transaction = await sequelize.transaction();

  try {
    await Promise.all(
      phieunxct.map(async (item) => {
        const { ID_Taisan, ID_TaisanQrcode, Soluong } = item;
        if (!groupedItems[ID_Taisan]) {
          groupedItems[ID_Taisan] = { ID_Taisan, ID_TaisanQrcode, Soluong };
        } else {
          groupedItems[ID_Taisan].Soluong += Soluong;
        }

        if (item.ID_TaisanQrcode !== null) {
          const checkNXCT = await Tb_PhieuNCCCT.findOne({
            where: {
              ID_TaisanQrcode: item.ID_TaisanQrcode,
              isDelete: 0,
            },
            transaction, // Đảm bảo transaction được truyền vào đây
          });

          if (checkNXCT) {
            throw new Error(
              `Đã nhập tài sản ${item.Tents} có mã Qrcode là : ${item.MaQrCode}`
            );
          } else {
            const createNCCCT = await Tb_PhieuNCCCT.create(
              {
                ID_Taisan: item.ID_Taisan,
                ID_TaisanQrcode: item.ID_TaisanQrcode,
                Soluong: item.Soluong,
                ID_PhieuNCC: data.ID_PhieuNCC,
                Dongia: item.Dongia || 0,
                Namsx: item.Namsx || null,
                isDelete: 0,
              },
              { transaction } // Đảm bảo transaction được truyền vào đây
            );
          }

          let updateTaisanQrCode = {};
          switch (data.ID_Nghiepvu) {
            case "5":
              updateTaisanQrCode = {
                iTinhtrang: 4,
                isDelete: 1,
              };
              break;
            case "6":
              updateTaisanQrCode = {
                iTinhtrang: 2,
                isDelete: 1,
              };
              break;
            case "7":
              updateTaisanQrCode = {
                iTinhtrang: 3,
                isDelete: 1,
              };
              break;
          }

          await Tb_TaisanQrCode.update(updateTaisanQrCode, {
            where: {
              ID_TaisanQrcode: item.ID_TaisanQrcode,
              isDelete: 0,
            },
            transaction,
          });
        } else {
          await Tb_PhieuNCCCT.create(
            {
              ID_Taisan: item.ID_Taisan,
              ID_TaisanQrcode: null,
              Soluong: item.Soluong,
              ID_PhieuNCC: data.ID_PhieuNCC,
              Dongia: item.Dongia || 0,
              Namsx: item.Namsx || null,
              isDelete: 0,
            },
            { transaction } // Đảm bảo transaction được truyền vào đây
          );
        }
      })
    );

    for (const item of Object.values(groupedItems)) {
      let updateTonkho = {};
      switch (data.ID_Nghiepvu) {
        case "5":
          updateTonkho = {
            XuattraNCC: Sequelize.literal(`XuattraNCC + ${item.Soluong}`),
            TonSosach: Sequelize.literal(
              `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
            ),
          };
          break;
        case "6":
          updateTonkho = {
            XuatThanhly: Sequelize.literal(`XuatThanhly + ${item.Soluong}`),
            TonSosach: Sequelize.literal(
              `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
            ),
          };
        case "7":
          updateTonkho = {
            XuatHuy: Sequelize.literal(`XuatHuy + ${item.Soluong}`),
            TonSosach: Sequelize.literal(
              `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
            ),
          };
          break;
      }
      const [updatedRowCount] = await Tb_Tonkho.update(updateTonkho, {
        where: {
          ID_Taisan: item.ID_Taisan,
          ID_Phongban: data.ID_Phieu1,
          TonSosach: { [Op.gte]: item.Soluong },
          ID_Nam: data.ID_Nam,
          ID_Quy: data.ID_Quy,
          isDelete: 0,
        },
        transaction,
      });

      if (updatedRowCount === 0) {
        throw new Error(
          `Số lượng không hợp lệ cho ID_Taisan: ${item.ID_Taisan}`
        );
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createTb_PhieuNXTNCC,
};
