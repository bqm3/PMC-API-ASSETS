const sequelize = require("../config/db.config");
const { Op, Sequelize } = require("sequelize");
const {
  Tb_GiaonhanTS,
  Tb_GiaonhanTSCT,
  Tb_Tonkho,
  Tb_TaisanQrCode,
  Ent_NhansuPBDA,
  Ent_Connguoi,
  Ent_Taisan,
  Ent_Phongbanda,
  Ent_Nam,
  Ent_Quy,
} = require("../models/setup.model");

// iGiaonhan = 1 : giao ts cho nhan su
// iGiaonhan = 2 : nhan ts tu nhan su (nghi viec or chuyen du an)

const create_Tb_GiaoNhanTS = async (giaonhantsct, reqData) => {
  const transaction = await sequelize.transaction();
  let data;
  let id_phongban;
  try {
    id_phongban = await Ent_NhansuPBDA.findOne({
      where: {
        ID_NSPB: reqData.Nguoinhan,
        isDelete: 0,
      },
      attributes: ["ID_Phongban"],
      transaction,
    });

    if (id_phongban == null) {
      throw new Error(`Có lỗi xảy ra!`);
    }

    data = await Tb_GiaonhanTS.create(
      {
        ID_Phongban: id_phongban.ID_Phongban,
        iGiaonhan: reqData.iGiaonhan,
        Nguoinhan: reqData.Nguoinhan,
        Ngay: reqData.Ngay,
        Ghichu: reqData.Ghichu || "",
        Nguoigiao: reqData.Nguoigiao,
        ID_Quy: reqData.ID_Quy,
        ID_Nam: reqData.ID_Nam,
        isDelete: 0,
      },
      { transaction }
    );

    if (giaonhantsct.length > 0 && giaonhantsct[0].ID_Taisan != null) {
      for (const item of giaonhantsct) {
        await create_Detail_GiaoNhanTSCT(item, data, transaction);
      }
    }
    await transaction.commit();
    return data;
  } catch (error) {
    await transaction.rollback(); // Rollback nếu lỗi
    throw new Error(error.message || "Lỗi khi tạo giao nhận tài sản");
  }
};

const create_Detail_GiaoNhanTSCT = async (item, data, transaction) => {
  if (item?.ID_TaisanQrcode != null) {
    const checkItem = await Tb_GiaonhanTSCT.findOne({
      where: {
        ID_TaisanQrcode: item.ID_TaisanQrcode,
        isDelete: 0,
      },
    });

    if (checkItem) {
      throw new Error(`Đã nhập tài sản ${item.ID_Taisan}`);
    }

    let updateUser = {
      ID_User: Number(data.iGiaonhan) === 1 ? data.Nguoinhan : 0,
    };

    await Tb_TaisanQrCode.update(updateUser, {
      where: { ID_TaisanQrcode: item.ID_TaisanQrcode, isDelete: 0 },
      transaction,
    });
  }

  let updateTonkho = {
    XuatgiaoNV: Sequelize.literal(
      `XuatgiaoNV ${Number(data.iGiaonhan) === 1 ? "+" : "-"} ${item.Soluong}`
    ),
    TonSosach: Sequelize.literal(
      `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
    ),
  };

  await Tb_GiaonhanTSCT.create(
    {
      ID_Giaonhan: data.ID_Giaonhan,
      ID_Taisan: item.ID_Taisan,
      ID_TaisanQrcode: item?.ID_TaisanQrcode,
      Tinhtrangmay: item?.Tinhtrangmay,
      Cacttlienquan: item?.Cacttlienquan,
      Soluong: item.Soluong,
      isDelete: 0,
    },
    { transaction }
  );

  const [updatedRowCount] = await Tb_Tonkho.update(updateTonkho, {
    where: {
      ID_Taisan: item.ID_Taisan,
      ID_Phongban: data.ID_Phongban,
      ID_Quy: data.ID_Quy,
      ID_Nam: data.ID_Nam,
      TonSosach: { [Op.gte]: item.Soluong },
      isDelete: 0,
    },
    transaction,
  });

  if (updatedRowCount === 0) {
    throw new Error(
      `Số lượng không hợp lệ vui lòng nhập lại số lượng cho tài sản ${item.ID_Taisan}`
    );
  }
};

const update_Tb_GiaoNhanTS = async (ID_Giaonhan, giaonhantsct) => {
  const transaction = await sequelize.transaction();
  const tonSosachLiteral = Sequelize.literal(
    `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
  );
  try {
    const tb_giaonhants = await Tb_GiaonhanTS.findOne({
      where: {
        ID_Giaonhan: ID_Giaonhan,
        isDelete: 0,
      },
      attributes: [
        "ID_Giaonhan",
        "ID_Phongban",
        "iGiaonhan",
        "ID_Nam",
        "ID_Quy",
        "Nguoinhan",
        "Nguoigiao",
      ],
      transaction,
    });

    const getAll = await Tb_GiaonhanTSCT.findAll({
      where: {
        ID_Giaonhan: ID_Giaonhan,
        isDelete: 0,
      },
      attributes: ["ID_Taisan", "ID_TaisanQrcode", "Soluong"],
      transaction,
    });

    // Tạo mảng chứa các cặp (ID_Taisan, ID_TaisanQrcode, Soluong) từ giaonhantsct
    const giaonhanPairs = giaonhantsct.map((item) => ({
      ID_Taisan: item.ID_Taisan,
      ID_TaisanQrcode: item?.ID_TaisanQrcode,
      Soluong: item?.Soluong,
    }));

    // Lọc các bản ghi cần xóa
    const recordsToDelete = getAll.filter(
      (getAllItem) =>
        !giaonhanPairs.some(
          (giaonhanItem) =>
            giaonhanItem.ID_Taisan === getAllItem.ID_Taisan &&
            giaonhanItem.ID_TaisanQrcode === getAllItem.ID_TaisanQrcode
        )
    );

    if (recordsToDelete.length > 0) {
      const idsToDelete = recordsToDelete.map((item) => ({
        ID_Taisan: item.ID_Taisan,
        ID_TaisanQrcode: item?.ID_TaisanQrcode,
        Soluong: item?.Soluong,
      }));

      for (const record of idsToDelete) {
        // Cập nhật trạng thái isDelete = 1
        await Tb_GiaonhanTSCT.update(
          { isDelete: 1 },
          {
            where: {
              ID_Taisan: record.ID_Taisan,
              ID_TaisanQrcode: record?.ID_TaisanQrcode,
            },
            transaction,
          }
        );

        // Cập nhật thông tin tùy theo trạng thái iGiaonhan
        if (record.ID_TaisanQrcode != null) {
          const userUpdate =
            tb_giaonhants.iGiaonhan == 1 ? null : tb_giaonhants.Nguoigiao;
          await Tb_TaisanQrCode.update(
            { ID_User: userUpdate },
            {
              where: {
                ID_TaisanQrcode: record.ID_TaisanQrcode,
              },
            }
          );
        }

        // Cập nhật số lượng trong Tb_Tonkho
        const xuatGiaoNVLiteral =
          tb_giaonhants.iGiaonhan == 1
            ? Sequelize.literal(`XuatgiaoNV - ${record.Soluong}`)
            : Sequelize.literal(`XuatgiaoNV + ${record.Soluong}`);

        console.log("xuatGiaoNVLiteral", xuatGiaoNVLiteral);

        await Tb_Tonkho.update(
          {
            XuatgiaoNV: xuatGiaoNVLiteral,
            TonSosach: tonSosachLiteral,
          },
          {
            where: {
              ID_Taisan: record.ID_Taisan,
              ID_Phongban: tb_giaonhants.ID_Phongban,
              ID_Quy: tb_giaonhants.ID_Quy,
              ID_Nam: tb_giaonhants.ID_Nam,
              isDelete: 0,
            },
          }
        );
      }
    }

    //update + create
    for (const item of giaonhantsct) {
      const tb_giaonhantsct = await Tb_GiaonhanTSCT.update(
        {
          Tinhtrangmay: item.Tinhtrangmay,
          Cacttlienquan: item.Cacttlienquan,
          Soluong: item.Soluong,
        },
        {
          where: {
            ID_Taisan: item.ID_Taisan,
            ID_TaisanQrcode: item?.ID_TaisanQrcode,
            ID_Giaonhan: ID_Giaonhan,
            isDelete: 0,
          },
          transaction,
        }
      );

      if (tb_giaonhantsct) {
        let updateTonkho = {};
        const delta = item.Soluong - item.SoluongCu;

        if (Number(tb_giaonhants.iGiaonhan) === 1) {
          updateTonkho = {
            XuatgiaoNV: Sequelize.literal(`XuatgiaoNV + ${delta}`),
            TonSosach: tonSosachLiteral,
          };
        } else {
          updateTonkho = {
            XuatgiaoNV: Sequelize.literal(`XuatgiaoNV - ${delta}`),
            TonSosach: tonSosachLiteral,
          };
        }

        const whereCondition = {
          ID_Taisan: item.ID_Taisan,
          ID_Phongban: tb_giaonhants.ID_Phongban,
          ID_Quy: tb_giaonhants.ID_Quy,
          ID_Nam: tb_giaonhants.ID_Nam,
          isDelete: 0,
        };

        if (Number(tb_giaonhants.iGiaonhan) === 1) {
          whereCondition.TonSosach = { [Op.gte]: delta };
        }

        const [updatedRowCount] = await Tb_Tonkho.update(updateTonkho, {
          where: whereCondition,
          transaction,
        });

        if (updatedRowCount === 0) {
          throw new Error(
            `Số lượng không hợp lệ vui lòng nhập lại số lượng cho tài sản ${item.ID_Taisan}`
          );
        }
      } else {
        await create_Detail_GiaoNhanTSCT(item, tb_giaonhants, transaction);
      }
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message || "Có lỗi xảy ra khi cập nhật!");
  }
};

const getDetail_Tb_GiaoNhanTS = async (ID_Giaonhan) => {
  try {
    const giaoNhan = await Tb_GiaonhanTS.findByPk(ID_Giaonhan, {
      where: {
        isDelete: 0,
      },
      attributes: [
        "ID_Giaonhan",
        "ID_Phongban",
        "iGiaonhan",
        "Nguoinhan",
        "Nguoigiao",
        "Ngay",
        "Ghichu",
        "ID_Quy",
        "ID_Nam",
        "isDelete",
      ],
      include: [
        {
          model: Tb_GiaonhanTSCT,
          as: "tb_giaonhantsct",
          attributes: [
            "ID_Taisan",
            "ID_Giaonhan",
            "ID_TaisanQrcode",
            "Tinhtrangmay",
            "Cacttlienquan",
            "Soluong",
            "isDelete",
          ],
          include: [
            {
              model: Ent_Taisan,
              as: "TaisanInfo",
            },
            {
              model: Tb_TaisanQrCode,
            },
          ],
          where: {
            isDelete: 0,
          },
        },
        {
          model: Ent_Phongbanda,
        },
        {
          model: Ent_NhansuPBDA,
          as: "NguoinhanInfo",
          attributes: [
            "ID_Connguoi",
            "ID_NSPB",
            "ID_Phongban",
            "Ngayvao",
            "iTinhtrang",
            "isDelete",
          ],
          include: [
            {
              model: Ent_Connguoi,
              attributes: ["Hoten"],
            },
          ],
          where: {
            isDelete: 0,
          },
        },
        {
          model: Ent_NhansuPBDA,
          as: "NguoigiaoInfo",
          attributes: [
            "ID_Connguoi",
            "ID_NSPB",
            "ID_Phongban",
            "Ngayvao",
            "iTinhtrang",
            "isDelete",
          ],
          include: [
            {
              model: Ent_Connguoi,
              attributes: ["Hoten"],
            },
          ],
          where: {
            isDelete: 0,
          },
        },
        {
          model: Ent_Nam,
        },
        {
          model: Ent_Quy,
        },
      ],
    });

    if (!giaoNhan) {
      throw new Error("Không tìm thấy thông tin giao nhận tài sản");
    }

    return giaoNhan;
  } catch (error) {
    throw new Error(
      error.message || "Có lỗi xảy ra khi lấy chi tiết giao nhận tài sản"
    );
  }
};

const delete_Tb_GiaonhanTS = async (ID_Giaonhan) => {
  const transaction = await sequelize.transaction();

  try {
    const giaoNhan = await Tb_GiaonhanTS.update(
      { isDelete: 1 },
      {
        where: {
          ID_Giaonhan: ID_Giaonhan,
          isDelete: 0,
        },
        transaction,
      }
    );

    if (!giaoNhan[0]) {
      throw new Error("Không tìm thấy thông tin giao nhận tài sản");
    }

    await Tb_GiaonhanTSCT.update(
      { isDelete: 1 },
      {
        where: { ID_Giaonhan: ID_Giaonhan },
        transaction,
      }
    );

    await transaction.commit();
    return {
      message: "Xóa thông tin giao nhận tài sản thành công",
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message || "Có lỗi xảy ra khi xóa giao nhận tài sản");
  }
};

const getAll_Tb_GiaonhanTS = async () => {
  try {
    const giaoNhanList = await Tb_GiaonhanTS.findAll({
      where: {
        isDelete: 0,
      },
      attributes: [
        "ID_Giaonhan",
        "ID_Phongban",
        "iGiaonhan",
        "Nguoinhan",
        "Nguoigiao",
        "Ngay",
        "ID_Quy",
        "ID_Nam",
        "Ghichu",
      ],
      include: [
        {
          model: Ent_Phongbanda,
        },
        {
          model: Ent_NhansuPBDA,
          as: "NguoinhanInfo",
          attributes: ["ID_Connguoi"],
          include: [
            {
              model: Ent_Connguoi,
              attributes: ["Hoten"],
            },
          ],
        },
        {
          model: Ent_NhansuPBDA,
          as: "NguoigiaoInfo",
          attributes: ["ID_Connguoi"],
          include: [
            {
              model: Ent_Connguoi,
              attributes: ["Hoten"],
            },
          ],
        },
        {
          model: Ent_Nam,
        },
        {
          model: Ent_Quy,
        },
      ],
    });

    return giaoNhanList;
  } catch (error) {
    throw new Error(
      error.message || "Có lỗi xảy ra khi lấy danh sách giao nhận tài sản"
    );
  }
};

const filter_Tb_GiaonhanTS = async (data) => {
  const resTonkho = await Tb_Tonkho.findAll({
    where: {
      ID_Phongban: data.ID_Phongban,
      ID_Nam: data.ID_Nam,
      ID_Quy: data.ID_Quy,
      isDelete: 0,
    },
    attributes: [
      "ID_Nam",
      "ID_Quy",
      "ID_Phongban",
      "ID_Taisan",
      "Tondau",
      "Tientondau",
      "Nhapngoai",
      "Tonsosach",
      "Kiemke",
      "Giatb",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Taisan,
      },
    ],
  });

  const resTaisanQrcode = await Tb_TaisanQrCode.findAll({
    where: {
      ID_Phongban: data.ID_Phongban,
      ID_Nam: data.ID_Nam,
      ID_Quy: data.ID_Quy,
      ID_User: null,
      isDelete: 0,
    },
    attributes: [
      "ID_TaisanQrcode",
      "ID_Taisan",
      "ID_PhieuNXCT",
      "ID_PhieuNCCCT",
      "Ngaykhoitao",
      "MaQrCode",
      "Giatri",
      "iTinhtrang",
      "ID_Nam",
      "ID_Quy",
      "ID_User",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Taisan,
      },
    ],
  });
  const resultTS = mergeData(resTonkho, resTaisanQrcode);
  const resNSPB = await Ent_NhansuPBDA.findAll({
    where: {
      ID_Phongban: data.ID_Phongban,
      isDelete: 0,
    },
    attributes: [
      "ID_NSPB",
      "ID_Phongban",
      "ID_Connguoi",
      "Ngayvao",
      "iTinhtrang",
      "isDelete",
    ],
    include: [
      {
        model: Ent_Connguoi,
      },
    ],
  });
  const resData = {
    resultTS,
    resNSPB,
  };

  return resData;
};

const mergeData = (resTonkho, resTaisanQrcode) => {
  const mergedData = [];

  // Step 1: Loop through resTonkho and try to find matching Taisan in resTaisanQrcode
  resTonkho?.forEach((tonKhoItem) => {
    const matchingQrCodeItems = resTaisanQrcode.filter(
      (qrCodeItem) => qrCodeItem.ID_Taisan === tonKhoItem.ID_Taisan
    );

    if (matchingQrCodeItems.length > 0) {
      // Step 2: Merge each matching item with tonKhoItem if there are QR codes
      matchingQrCodeItems.forEach((qrCodeItem) => {
        const mergedItem = {
          ...tonKhoItem.get({ plain: true }), // Flatten tonKhoItem
          ...qrCodeItem.get({ plain: true }), // Flatten qrCodeItem
          ent_taisan: {
            ...(tonKhoItem.ent_taisan
              ? tonKhoItem.ent_taisan.get({ plain: true })
              : {}), // Include ent_taisan from tonKhoItem if it exists
            ...(qrCodeItem.ent_taisan
              ? qrCodeItem.ent_taisan.get({ plain: true })
              : {}), // Overwrite or add properties from qrCodeItem's ent_taisan if it exists
          },
        };

        mergedData.push(mergedItem);
      });
    } else {
      // Step 3: Include tonKhoItem even if there are no matching QR code items
      const mergedItemWithoutQrCode = {
        ...tonKhoItem.get({ plain: true }), // Flatten tonKhoItem
        ent_taisan: {
          ...(tonKhoItem.ent_taisan
            ? tonKhoItem.ent_taisan.get({ plain: true })
            : {}), // Include ent_taisan from tonKhoItem if it exists
        },
        MaQrCode: null, // Indicate that no QR code was found
        Giatri: null, // Set other related QR code properties to null if needed
        iTinhtrang: null, // Same for condition if needed
      };

      mergedData.push(mergedItemWithoutQrCode);
    }
  });

  return mergedData;
};

const getBy_IDPhongban_GiaonhanTS = async (ID_Phongban) => {
  try {
    const giaoNhanList = await Tb_GiaonhanTS.findAll({
      where: {
        ID_Phongban: ID_Phongban,
        isDelete: 0,
      },
      attributes: [
        "ID_Giaonhan",
        "ID_Phongban",
        "iGiaonhan",
        "Nguoinhan",
        "Nguoigiao",
        "Ngay",
        "ID_Quy",
        "ID_Nam",
        "Ghichu",
      ],
      include: [
        {
          model: Ent_Phongbanda,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Ent_NhansuPBDA,
          as: "NguoinhanInfo",
          attributes: ["ID_Connguoi"],
          include: [
            {
              model: Ent_Connguoi,
              attributes: ["Hoten"],
            },
          ],
        },
        {
          model: Ent_NhansuPBDA,
          as: "NguoigiaoInfo",
          attributes: ["ID_Connguoi"],
          include: [
            {
              model: Ent_Connguoi,
              attributes: ["Hoten"],
            },
          ],
        },
        {
          model: Ent_Nam,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Ent_Quy,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    return giaoNhanList;
  } catch (error) {
    throw new Error(
      error.message || "Có lỗi xảy ra khi lấy danh sách giao nhận tài sản"
    );
  }
};

module.exports = {
  create_Tb_GiaoNhanTS,
  update_Tb_GiaoNhanTS,
  getDetail_Tb_GiaoNhanTS,
  delete_Tb_GiaonhanTS,
  getAll_Tb_GiaonhanTS,
  getBy_IDPhongban_GiaonhanTS,
  filter_Tb_GiaonhanTS,
};
