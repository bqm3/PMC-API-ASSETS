const { uploadFile } = require("../middleware/image.middleware");
const {
  Tb_PhieuNCCCT,
  Ent_Phongbanda,
  Tb_Tonkho,
  Ent_Taisan,
  Ent_Nhomts,
  Tb_TaisanQrCode,
  Tb_PhieuNCC,
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");
const formatDateTime = require("../utils/formatDatetime");
const { getDuanVsTaisanDetails } = require("./create_qr_code.service");

//phiếu 6.1.2 nhập hàng từ nhà cung cấp

const create_PhieuNhapNCC = async (phieunxct, data, transaction) => {
  const groupedItems = {};
  let ID_PhieuNXCT_Items = [];
  try {
    // Nhóm và tính tổng theo ID_Taisan
    phieunxct.forEach((item) => {
      const { ID_Taisan, Dongia, Soluong, Namsx } = item;
      if (!groupedItems[ID_Taisan]) {
        groupedItems[ID_Taisan] = {
          ID_Taisan,
          Namsx,
          Dongia: 0,
          Soluong: 0,
        };
      }
      // Cộng dồn tổng Dongia và Soluong
      groupedItems[ID_Taisan].Dongia = Number(Dongia);
      groupedItems[ID_Taisan].Soluong += Number(Soluong);
    });

    await Promise.all(
      Object.values(groupedItems).map(async (groupedItem) => {
        const newPhieuCCCCT = await Tb_PhieuNCCCT.create(
          {
            ID_PhieuNCC: data.ID_PhieuNCC,
            ID_Taisan: groupedItem.ID_Taisan,
            Dongia: groupedItem.Dongia,
            Namsx: groupedItem.Namsx,
            Soluong: groupedItem.Soluong,
            isDelete: 0,
          },
          { transaction }
        );
        ID_PhieuNXCT_Items.push({
          ID_Taisan: groupedItem.ID_Taisan,
          ID_PhieuNCCCT: newPhieuCCCCT.ID_PhieuNCCCT,
        });
      })
    );

    await Promise.all(
      Object.values(groupedItems).map(async (groupedItem) => {
        // Kiểm tra xem có bản ghi tồn tại trong Tb_Tonkho không
        const tonkho = await Tb_Tonkho.findOne({
          where: {
            ID_Phongban: data.ID_Phongban,
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
            ID_Taisan: groupedItem.ID_Taisan,
          },
          transaction,
        });

        if (tonkho) {
          // Nếu bản ghi đã tồn tại, cập nhật Nhapngoai và Tiennhapngoai
          await Tb_Tonkho.update(
            {
              Nhapngoai: tonkho.Nhapngoai + groupedItem.Soluong,
              Tiennhapngoai:
                tonkho.Tiennhapngoai + groupedItem.Dongia * groupedItem.Soluong,
              TonSosach: tonkho.TonSosach + groupedItem.Soluong,
            },
            {
              where: {
                ID_Phongban: data.ID_Phieu1,
                ID_Nam: data.ID_Nam,
                ID_Quy: data.ID_Quy,
                ID_Taisan: groupedItem.ID_Taisan,
              },
              transaction,
            }
          );
        } else {
          // Nếu không tìm thấy bản ghi, thêm mới vào Tb_Tonkho
          await Tb_Tonkho.create(
            {
              ID_Taisan: groupedItem.ID_Taisan,
              ID_Nam: data.ID_Nam,
              ID_Quy: data.ID_Quy,
              ID_Thang: data.ID_Thang,
              ID_Phongban: data.ID_Phieu1,
              Nhapngoai: groupedItem.Soluong,
              Tiennhapngoai: groupedItem.Dongia * groupedItem.Soluong,
              TonSosach: groupedItem.Soluong,
            },
            { transaction }
          );
        }
      })
    );

    await Promise.all(
      Object.values(groupedItems).map(async (groupedItem) => {
        const taisan = await Ent_Taisan.findOne({
          where: {
            ID_Taisan: groupedItem.ID_Taisan,
            isDelete: 0,
          },
          attributes: ["ID_Taisan", "i_MaQrCode"],
          transaction,
        });

        if (taisan.i_MaQrCode == 0) {
          const [duan, taisanDetails] = await getDuanVsTaisanDetails(
            data.ID_Phongban,
            taisan.ID_Taisan
          );
          const foundItem = ID_PhieuNXCT_Items.find(
            (item) => item.ID_Taisan === taisan.ID_Taisan
          );

          const Thuoc = duan?.Thuoc;
          const ManhomTs = taisanDetails.ent_nhomts.Manhom;
          const MaID = taisanDetails.ID_Taisan;
          const MaTaisan = taisanDetails.Mats;
          const Ngay = formatDateTime(data.NgayNX);

          const createQrCodeEntry = async (index) => {
            const MaQrCode =
              index >= 1
                ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}`
                : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;

            await Tb_TaisanQrCode.create(
              {
                ID_Nam: data.ID_Nam,
                ID_Quy: data.ID_Quy,
                ID_Taisan: foundItem.ID_Taisan,
                ID_PhieuNCCCT: foundItem.ID_PhieuNCCCT,
                ID_Phongban: data.ID_Phieu1,
                Giatri: groupedItem.Dongia,
                Ngaykhoitao: data.NgayNX,
                MaQrCode: MaQrCode,
                Namsx: groupedItem.Namsx,
                Nambdsd: null,
                Ghichu: "",
                iTinhtrang: 0,
              },
              { transaction }
            );
          };

          if (`${groupedItem.Soluong}` > "1") {
            for (let i = 1; i <= groupedItem.Soluong; i++) {
              await createQrCodeEntry(i);
            }
          } else {
            await createQrCodeEntry(1);
          }
          console.log(
            `Lưu vào bảng Tb_TaisanQrcode thành công cho ID_Taisan: ${foundItem.ID_Taisan}`
          );
        }
      })
    );
  } catch (error) {
    throw new Error(`Có lỗi xảy ra khi tạo phiếu nhập NCC: ${error.message}`);
  }
};

// 5 Xuat tra ncc
// 6 xuat thanh ly
// 7 Xuat huy
const create_PhieuXuatNCC = async (item, data, transaction) => {
  if (item.ID_TaisanQrcode !== null) {
    const checkUserTaisan = await Tb_TaisanQrCode.findByPk(
      item.ID_TaisanQrcode,
      {
        attributes: ["ID_TaisanQrcode", "ID_User"],
      },
      transaction
    );

    if (checkUserTaisan.ID_User != null && checkUserTaisan.ID_User != 0) {
      throw new Error(
        `Tài sản này đã giao cho user có ID là : ${checkUserTaisan.ID_User}`
      );
    }

    const checkNXCT = await Tb_PhieuNCCCT.findOne({
      where: {
        ID_TaisanQrcode: item.ID_TaisanQrcode,
        isDelete: 0,
      },
      transaction,
    });

    if (checkNXCT) {
      throw new Error(
        `Đã nhập tài sản ${item.Tents} có mã Qrcode là : ${item.MaQrCode}`
      );
    }

    let updateTaisanQrCode = {};
    switch (data.ID_Nghiepvu) {
      case "5":
        updateTaisanQrCode = { iTinhtrang: 4, isDelete: 1 };
        break;
      case "6":
        updateTaisanQrCode = { iTinhtrang: 2, isDelete: 1 };
        break;
      case "7":
        updateTaisanQrCode = { iTinhtrang: 3, isDelete: 1 };
        break;
    }

    await Tb_TaisanQrCode.update(updateTaisanQrCode, {
      where: { ID_TaisanQrcode: item.ID_TaisanQrcode },
      transaction,
    });
  }
  await Tb_PhieuNCCCT.create(
    {
      ID_Taisan: item.ID_Taisan,
      ID_TaisanQrcode: item?.ID_TaisanQrcode,
      Soluong: item.Soluong,
      ID_PhieuNCC: data.ID_PhieuNCC,
      Dongia: item.Dongia || 0,
      Namsx: item.Namsx || null,
      isDelete: 0,
    },
    { transaction }
  );
  
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
      break;
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
    throw new Error(`Số lượng không hợp lệ cho ID_Taisan: ${item.ID_Taisan}`);
  }
};

const updateTb_PhieuNCCCT = async (phieunxct, ID_PhieuNCC, data) => {
  const transaction = await sequelize.transaction();
  try {
    const groupedItems = {};

    // Nhóm và tổng hợp theo ID_Taisan
    phieunxct.forEach((item) => {
      const { ID_Taisan, Dongia, Soluong, Namsx, isDelete } = item;
      if (!groupedItems[ID_Taisan]) {
        groupedItems[ID_Taisan] = {
          ID_Taisan,
          Namsx,
          Dongia: 0,
          Soluong: 0,
          isDelete,
        };
      }
      groupedItems[ID_Taisan].Dongia = Number(Dongia);
      groupedItems[ID_Taisan].Soluong += Number(Soluong);
    });

    // Lấy các bản ghi hiện tại
    const currentItems = await Tb_PhieuNCCCT.findAll({
      where: { ID_PhieuNCC },
      transaction,
    });

    // Xóa các bản ghi không còn trong danh sách update
    const currentItemIds = currentItems.map((item) => item.ID_PhieuNCCCT);
    const newItemIds = phieunxct
      .filter((item) => item.ID_PhieuNCCCT)
      .map((item) => item.ID_PhieuNCCCT);
    const itemsToDelete = currentItemIds.filter(
      (id) => !newItemIds.includes(id)
    );

    if (itemsToDelete.length > 0) {
      await Tb_PhieuNCCCT.destroy({
        where: { ID_PhieuNCCCT: itemsToDelete },
        transaction,
      });
    }

    // Cập nhật hoặc tạo mới các bản ghi
    await Promise.all(
      Object.values(groupedItems).map(async (groupedItem) => {
        const existingItem = currentItems.find(
          (item) => item.ID_Taisan === groupedItem.ID_Taisan
        );

        if (existingItem) {
          // Cập nhật bản ghi hiện tại
          await Tb_PhieuNCCCT.update(
            {
              Dongia: groupedItem.Dongia,
              Namsx: groupedItem.Namsx,
              Soluong: groupedItem.Soluong,
              isDelete: 0,
            },
            {
              where: { ID_PhieuNCCCT: existingItem.ID_PhieuNCCCT },
              transaction,
            }
          );
        } else {
          // Tạo mới bản ghi trong bảng Tb_PhieuNCCCT
          const newPhieuCCCCT = await Tb_PhieuNCCCT.create(
            {
              ID_PhieuNCC,
              ID_Taisan: groupedItem.ID_Taisan,
              Dongia: groupedItem.Dongia,
              Namsx: groupedItem.Namsx,
              Soluong: groupedItem.Soluong,
              isDelete: 0,
            },
            { transaction }
          );

          // Nếu là tạo mới, thêm vào bảng tồn kho và tạo QR code
          if (data.ID_Nghiepvu == 2) {
            const tonkho = await Tb_Tonkho.findOne({
              where: {
                ID_Phongban: data.ID_Phieu1,
                ID_Nam: data.ID_Nam,
                ID_Quy: data.ID_Quy,
                ID_Taisan: groupedItem.ID_Taisan,
              },
              transaction,
            });

            if (tonkho) {
              await Tb_Tonkho.update(
                {
                  Nhapngoai: tonkho.Nhapngoai + groupedItem.Soluong,
                  TonSosach: tonkho.TonSosach + groupedItem.Soluong,
                  Tiennhapngoai:
                    tonkho.Tiennhapngoai +
                    groupedItem.Dongia * groupedItem.Soluong,
                },
                {
                  where: {
                    ID_Phongban: data.ID_Phieu1,
                    ID_Nam: data.ID_Nam,
                    ID_Quy: data.ID_Quy,
                    ID_Taisan: groupedItem.ID_Taisan,
                  },
                  transaction,
                }
              );
            } else {
              await Tb_Tonkho.create(
                {
                  ID_Taisan: groupedItem.ID_Taisan,
                  ID_Nam: data.ID_Nam,
                  ID_Quy: data.ID_Quy,
                  ID_Thang: data.ID_Thang,
                  ID_Phongban: data.ID_Phieu1,
                  Nhapngoai: groupedItem.Soluong,
                  Tiennhapngoai: groupedItem.Dongia * groupedItem.Soluong,
                  TonSosach: groupedItem.Soluong,
                },
                { transaction }
              );
            }

            // Xử lý QR code nếu tài sản chưa có mã QR
            const taisan = await Ent_Taisan.findOne({
              where: {
                ID_Taisan: groupedItem.ID_Taisan,
                isDelete: 0,
              },
              attributes: ["ID_Taisan", "i_MaQrCode"],
              transaction,
            });

            if (taisan?.i_MaQrCode === 0) {
              await Tb_TaisanQrCode.destroy({
                where: {
                  ID_Taisan: groupedItem.ID_Taisan,
                  ID_PhieuNCCCT: newPhieuCCCCT.ID_PhieuNCCCT,
                },
                transaction,
              });

              const [duan, taisanDetails] = await getDuanVsTaisanDetails(
                data.ID_Phongban,
                taisan.ID_Taisan
              );

              const Thuoc = duan?.Thuoc;
              const ManhomTs = taisanDetails.ent_nhomts.Manhom;
              const MaID = taisanDetails.ID_Taisan;
              const MaTaisan = taisanDetails.Mats;
              const Ngay = formatDateTime(data.NgayNX);

              const createQrCodeEntry = async (index) => {
                const MaQrCode =
                  index >= 1
                    ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}`
                    : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;

                await Tb_TaisanQrCode.create(
                  {
                    ID_Nam: data.ID_Nam,
                    ID_Quy: data.ID_Quy,
                    ID_Taisan: groupedItem.ID_Taisan,
                    ID_PhieuNCCCT: newPhieuCCCCT.ID_PhieuNCCCT,
                    ID_Phongban: data.ID_Phieu1,
                    Giatri: groupedItem.Dongia,
                    Ngaykhoitao: data.NgayNX,
                    MaQrCode,
                    Namsx: groupedItem.Namsx,
                    Nambdsd: null,
                    Ghichu: "",
                    iTinhtrang: 0,
                  },
                  { transaction }
                );
              };

              if (`${groupedItem.Soluong}` > "1") {
                for (let i = 1; i <= groupedItem.Soluong; i++) {
                  await createQrCodeEntry(i);
                }
              } else {
                await createQrCodeEntry(1);
              }
            }
          }
        }
      })
    );

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAllTb_PhieuNCCCT = async () => {
  // Điều kiện để lấy các bản ghi không bị XCTóa
  let whereClause = {
    isDelete: 0,
  };

  // Thực hiện truy vấn với Sequelize
  const res = await Tb_PhieuNCCCT.findAll({
    attributes: [
      "ID_PhieuNCCCT",
      "ID_PhieuNCC",
      "ID_Taisan",
      "Dongia",
      "Soluong",
      "Namsx",
      "isDelete",
    ],
    where: whereClause,
  });

  return res;
};

const scanTb_PhieuNCCCT = async (data) => {
  const file = await uploadFile(data.images);
  const res = await Tb_PhieuNCCCT.create({
    Anhts: file ? file.id : "",
    ID_TaisanQrcode: data.ID_TaisanQrcode,
    ID_PhieuNCC: data.ID_PhieuNCC,
    ID_Taisan: data.ID_Taisan,
    Dongia: data.Dongia,
    Soluong: data.Soluong || 1,
    Namsx: data.Namsx,
  });
  return res;
};

const getTaiSanPB = async (
  ID_Phongban,
  ID_Noixuat,
  ID_Quy,
  ID_Loainhom,
  ID_Nghiepvu
) => {
  const whereCondition = {
    ID_Phieu1: ID_Phongban,
    ID_Phieu2: ID_Noixuat,
    ID_Quy,
    ID_Loainhom,
    ID_Nghiepvu,
    isDelete: 0,
  };

  try {
    const [pccResults, tonkhos, taisanQrCodes] = await Promise.all([
      Tb_PhieuNCC.findAll({
        where: whereCondition,
        include: [
          {
            model: Tb_PhieuNCCCT,
            as: "tb_phieunccct",
            where: { isDelete: 0 },
            attributes: ["ID_Taisan", "Dongia", "Soluong"],
            include: [
              {
                model: Ent_Taisan,
                as: "ent_taisan",
                attributes: ["Tents", "ID_Nhomts"],
              },
            ],
          },
        ],
      }),

      Tb_Tonkho.findAll({
        where: {
          ID_Phongban,
          ID_Quy,
          isDelete: 0,
        },
        attributes: ["ID_Taisan", "TonSosach"],
      }),

      Tb_TaisanQrCode.findAll({
        where: {
          ID_Phongban,
          isDelete: 0,
        },
        attributes: ["ID_TaisanQrcode", "ID_Taisan", "MaQrCode"],
      }),
    ]);

    // Tạo map tồn kho từ kết quả truy vấn tồn kho
    const tonKhoMap = tonkhos.reduce((map, tk) => {
      map[tk.ID_Taisan] = tk.TonSosach;
      return map;
    }, {});

    // Tạo map mã QR từ kết quả truy vấn mã QR
    const qrCodeMap = taisanQrCodes.reduce((map, qr) => {
      if (!map[qr.ID_Taisan]) {
        map[qr.ID_Taisan] = [];
      }
      map[qr.ID_Taisan].push({
        ID_TaisanQrcode: qr.ID_TaisanQrcode,
        MaQrCode: qr.MaQrCode,
      });
      return map;
    }, {});

    const resultWithQrCode = pccResults.flatMap((pcc) =>
      pcc.tb_phieunccct.map((item) => ({
        ID_Taisan: item.ID_Taisan,
        Dongia: item.Dongia,
        Soluongnhap: item.Soluong,
        TonSosach: tonKhoMap[item.ID_Taisan] || 0,
        Tents: item.ent_taisan.Tents,
        TaisanQrcode: qrCodeMap[item.ID_Taisan] || [],
      }))
    );

    return resultWithQrCode;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

module.exports = {
  create_PhieuNhapNCC,
  create_PhieuXuatNCC,
  getAllTb_PhieuNCCCT,
  updateTb_PhieuNCCCT,
  scanTb_PhieuNCCCT,
  getTaiSanPB,
};
