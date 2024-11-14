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
const { getDuanVsTaisanDetails, createQrCode } = require("./create_qr_code.service");
// ================================ Tạo mới
//phiếu 6.1.2 nhập hàng từ nhà cung cấp
// 2 Nhập hàng từ nhà cung cấp
const create_PhieuNhapNCC = async (phieunxct, data, transaction) => {
  try {
    const groupedItems = phieunxct.reduce(
      (acc, { ID_Taisan, Dongia, Soluong, Namsx }) => {
        if (!acc[ID_Taisan]) {
          acc[ID_Taisan] = {
            ID_Taisan,
            Namsx,
            Dongia: Number(Dongia),
            Soluong: 0,
          };
        }
        acc[ID_Taisan].Soluong += Number(Soluong);
        return acc;
      },
      {}
    );

    const phieuNCCCTData = Object.values(groupedItems).map((item) => ({
      ID_PhieuNCC: data.ID_PhieuNCC,
      ID_Taisan: item.ID_Taisan,
      Dongia: item.Dongia,
      Namsx: item.Namsx,
      Soluong: item.Soluong,
      isDelete: 0,
    }));

    const createdPhieuNCCCTs = await Tb_PhieuNCCCT.bulkCreate(phieuNCCCTData, {
      transaction,
      returning: true,
    });

    await Promise.all(
      createdPhieuNCCCTs.map((record) =>
        createQrCode(record, data, transaction)
      )
    );

    const tonkhoItems = await Tb_Tonkho.findAll({
      where: {
        ID_Phongban: data.ID_Phieu1,
        ID_Nam: data.ID_Nam,
        ID_Quy: data.ID_Quy,
        ID_Taisan: Object.keys(groupedItems),
        isDelete: 0,
      },
      transaction,
    });

    const tonkhoMap = tonkhoItems.reduce((acc, item) => {
      acc[item.ID_Taisan] = item;
      return acc;
    }, {});

    const updateOperations = [];
    const createOperations = [];

    Object.values(groupedItems).forEach((groupedItem) => {
      const existingTonkho = tonkhoMap[groupedItem.ID_Taisan];
      const soluong = groupedItem.Soluong;
      const dongia = groupedItem.Dongia;

      if (existingTonkho) {
        const TonSosach =
          existingTonkho.Tondau +
          existingTonkho.Nhapngoai +
          existingTonkho.Nhapkhac +
          existingTonkho.NhapNB -
          existingTonkho.XuatNB -
          existingTonkho.XuattraNCC -
          existingTonkho.XuatThanhly -
          existingTonkho.XuatHuy -
          existingTonkho.XuatgiaoNV + soluong;

        updateOperations.push({
          where: {
            ID_Phongban: data.ID_Phieu1,
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
            ID_Taisan: groupedItem.ID_Taisan,
            Namsx: groupedItem.Namsx,
            isDelete: 0,
          },
          update: {
            Nhapngoai: existingTonkho.Nhapngoai + soluong,
            Tiennhapngoai: existingTonkho.Tiennhapngoai + soluong * dongia,
            TonSosach,
          },
        });
      } else {
        createOperations.push({
          ID_Taisan: groupedItem.ID_Taisan,
          Namsx: groupedItem.Namsx,
          ID_Nam: data.ID_Nam,
          ID_Quy: data.ID_Quy,
          ID_Thang: data.ID_Thang,
          ID_Phongban: data.ID_Phieu1,
          Nhapngoai: soluong,
          Tiennhapngoai: soluong * dongia,
          TonSosach: soluong,
          isDelete: 0,
        });
      }
    });

    // Execute bulk operations
    await Promise.all(
      [
        ...updateOperations.map((op) =>
          Tb_Tonkho.update(op.update, {
            where: op.where,
            transaction,
          })
        ),
        createOperations.length > 0 &&
          Tb_Tonkho.bulkCreate(createOperations, { transaction }),
      ].filter(Boolean)
    );

    return true;
  } catch (error) {
    console.error("Error in create_PhieuNhapNCC:", error);
    throw error;
  }
};

// 5 Xuat tra ncc
// 6 xuat thanh ly
// 7 Xuat huy
const create_PhieuXuatNCC = async (item, data, transaction) => {
  if (item.ID_TaisanQrcode !== null) {
    const checkUserTaisan = await Tb_TaisanQrCode.findOne(
      {
        attributes: ["ID_TaisanQrcode", "ID_User", "isDelete"],
        where: {
          isDelete: 0,
          ID_TaisanQrcode: item.ID_TaisanQrcode,
        },
      },
      transaction
    );

    if (checkUserTaisan?.ID_User != null && checkUserTaisan?.ID_User != 0) {
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
    switch (Number(data.ID_Nghiepvu)) {
      case 5:
        updateTaisanQrCode = { iTinhtrang: 4, isDelete: 1 };
        break;
      case 6:
        updateTaisanQrCode = { iTinhtrang: 2, isDelete: 1 };
        break;
      case 7:
        updateTaisanQrCode = { iTinhtrang: 3, isDelete: 1 };
        break;
      default:
        throw Error("Lỗi khi cập nhật qr code");
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

  //update ton kho
  await updateTonkho(item, data, item.Soluong, transaction);
};
// những dự án đã triển khai, những dự án nào chỉ mới kê khai, những khối nào đã triển khai của dự án

// ================================= Cập nhật
// 6.1.2 Cập nhập phiếu nhập hàng từ nhà cung cấp
const updatePhieuNhapHangNCC = async (phieunxct, data, transaction) => {
  try {
    const updatedAndCreated = phieunxct.filter(
      (item) => item.isUpdate === 1 && item.isDelete === 0
    );

    const deleted = phieunxct.filter(
      (item) => item.isUpdate === 1 && item.isDelete === 1
    );

    const existingPhieuNCCCts = await Tb_PhieuNCCCT.findAll({
      where: {
        ID_PhieuNCC: data.ID_PhieuNCC,
        isDelete: 0,
      },
      transaction,
    });

    const existingIDs = existingPhieuNCCCts.map((item) => item.ID_Taisan);

    // Mảng chứa những phần tử cần tạo mới
    const create = updatedAndCreated.filter(
      (item) => !existingIDs.includes(item.ID_Taisan)
    );

    // Mảng chứa những phần tử cần cập nhật
    const update = updatedAndCreated.filter((item) =>
      existingIDs.includes(item.ID_Taisan)
    );

    // Thực hiện tạo mới
    if (create.length > 0 && create[0].ID_Taisan != null) {
      await create_PhieuNhapNCC(create, data, transaction);
    }

    // Thực hiện cập nhật
    if (update.length > 0) {
      for (const item of update) {
        const existingItem = existingPhieuNCCCts.find(
          (existing) => existing.ID_Taisan === item.ID_Taisan
        );
        if (existingItem) {
          const delta = item.Soluong - existingItem.Soluong;
          let priceChanged = false;
          if (item.Dongia !== existingItem.Dongia) {
            priceChanged = true;
            deltaTien = item.Soluong * (item.Dongia - existingItem.Dongia);
          }
          await Tb_PhieuNCCCT.update(
            {
              Dongia: item.Dongia,
              Namsx: item.Namsx,
              Soluong: item.Soluong,
              isDelete: 0,
            },
            {
              where: { ID_PhieuNCCCT: existingItem.ID_PhieuNCCCT },
              transaction,
            }
          );
          await updateTonkho(item, data, delta, priceChanged, deltaTien, transaction);
          await Tb_TaisanQrCode.update(
            {
              isDelete: 2,
            },
            {
              where: {
                ID_PhieuNCCCT: item.ID_PhieuNCCCT,
                isDelete: 0,
              },
              transaction,
            }
          );
          await createQrCode(item, data, transaction);
        }
      }
    }

    // Xử lý các bản ghi bị xóa
    if (deleted.length > 0) {
      for (const item of deleted) {
        const delta = -item.Soluong;
        await Tb_PhieuNCCCT.update(
          { isDelete: 1 },
          {
            where: { ID_PhieuNCCCT: item.ID_PhieuNCCCT },
            transaction,
          }
        );
        await updateTonkho(item, data, delta, transaction);
        await Tb_TaisanQrCode.update(
          {
            isDelete: 1,
          },
          {
            where: {
              ID_PhieuNCCCT: item.ID_PhieuNCCCT,
              isDelete: 0,
            },
            transaction,
          }
        );
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};



// ( Nghiệp vụ 5, 6, 7)
// 6.1.4 Phiêu xuất trả nhà cung cấp
// 6.1.5 Phiếu xuất thanh lý
// 6.1.6 Phiếu xuât hủy
const updatePhieuNCCCT = async (reqData, phieunccct) => {
  const transaction = await sequelize.transaction();
  try {
    const updatedAndCreated = phieunccct.filter(
      (item) => item.isUpdate === 1 && item.isDelete === 0
    );
    const deleted = phieunccct.filter(
      (item) => item.isUpdate === 1 && item.isDelete === 1
    );

    const existingPhieuNCCCts = await Tb_PhieuNCCCT.findAll({
      where: {
        ID_PhieuNCC: reqData.ID_PhieuNCC,
        isDelete: 0,
      },
      transaction,
    });

    const existingMap = new Map(
      existingPhieuNCCCts.map((existing) => [
        `${existing.ID_Taisan}_${existing.ID_TaisanQrcode || "null"}`,
        existing,
      ])
    );

    const deletePromises = deleted.map(async (item) => {
      const key = `${item.ID_Taisan}_${item.ID_TaisanQrcode || "null"}`;
      const deleteItem = existingMap.get(key);

      if (deleteItem) {
        await Tb_PhieuNCCCT.update(
          { isDelete: 1 },
          {
            where: { ID_PhieuNCCCT: deleteItem.ID_PhieuNCCCT },
            transaction,
          }
        );
        if (deleteItem.ID_TaisanQrcode) {
          await Tb_TaisanQrCode.update(
            { iTinhtrang: 0, isDelete: 0 },
            {
              where: {
                ID_TaisanQrcode: deleteItem.ID_TaisanQrcode,
                isDelete: 0,
              },
              transaction,
            }
          );
        }
        const delta = -item.Soluong;
        await updateTonkho(item, reqData, delta, transaction);
      }
    });

    const updatePromises = updatedAndCreated.map(async (item) => {
      const key = `${item.ID_Taisan}_${item.ID_TaisanQrcode || "null"}`;
      const existingItem = existingMap.get(key);

      let delta = 0;
      if (existingItem) {
        delta = item.Soluong - existingItem.Soluong;
        await Tb_PhieuNCCCT.update(
          { Soluong: item.Soluong },
          {
            where: { ID_PhieuNCCCT: existingItem.ID_PhieuNCCCT, isDelete: 0 },
            transaction,
          }
        );
        await updateTonkho(item, reqData, delta, transaction);
      } else {
        await create_PhieuXuatNCC(item, reqData, transaction);
      }
    });

    await Promise.all([...deletePromises, ...updatePromises]);
    await transaction.commit();

    return { message: "Cập nhật phiếu NCC thành công!" };
  } catch (error) {
    await transaction.rollback();
    console.error("Lỗi khi cập nhật Tb_PhieuNCCCT:", error);
    throw error;
  }
};

const updateTonkho = async (item, reqData, Soluong, priceChanged = false, deltaTien, transaction) => {
  let tonkho = {};
  const tonSosachLiteral = Sequelize.literal(
    `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
  );
  switch (Number(reqData.ID_Nghiepvu)) {
    case 2:
      tonkho = {
        Nhapngoai: Sequelize.literal(`Nhapngoai + ${Soluong}`),
        Tiennhapngoai: priceChanged
          ? Sequelize.literal(`Nhapngoai * ${deltaTien}`)
          : Sequelize.literal(`Tiennhapngoai + ${Soluong} * ${item.Dongia}`),
        TonSosach: tonSosachLiteral,
      };
      break;
    case 5:
      tonkho = {
        XuattraNCC: Sequelize.literal(`XuattraNCC + ${Soluong}`),
        TonSosach: tonSosachLiteral,
      };
      break;
    case 6:
      tonkho = {
        XuatThanhly: Sequelize.literal(`XuatThanhly + ${Soluong}`),
        TonSosach: tonSosachLiteral,
      };
      break;
    case 7:
      tonkho = {
        XuatHuy: Sequelize.literal(`XuatHuy + ${Soluong}`),
        TonSosach: tonSosachLiteral,
      };
      break;
    default:
      throw new Error("Lỗi khi update tồn kho");
  }

  const whereCondition = {
    ID_Taisan: item.ID_Taisan,
    Namsx: item.Namsx,
    ID_Phongban: reqData.ID_Phieu1,
    ID_Nam: reqData.ID_Nam,
    ID_Quy: reqData.ID_Quy,
    isDelete: 0,
  };

  // Kiểm tra tồn kho chỉ khi số lượng thay đổi
  if (Number(reqData.ID_Nghiepvu) !== 2 && Soluong < 0) {
    whereCondition.TonSosach = { [Op.gte]: Math.abs(Soluong) };
  }

  const [updatedRowCount] = await Tb_Tonkho.update(tonkho, {
    where: whereCondition,
    transaction,
  });

  console.log('updatedRowCount', updatedRowCount)
  if (updatedRowCount === 0) {
    throw new Error(
      `Số lượng không hợp lệ cho tài sản: ${item?.ent_taisan?.Tents ?? item.ID_Taisan}`
    );
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
  ID_NoiNhap,
  ID_NoiXuat,
  ID_Quy,
  ID_Nam,
  ID_Loainhom,
  ID_Nghiepvu
) => {
  const whereCondition = {
    ID_Phieu1: ID_NoiXuat,
    ID_Quy,
    ID_Nghiepvu: 2,
    ID_Loainhom,
    isDelete: 0,
  };
  const transaction = await sequelize.transaction();
  try {
    // const existingRecord = await Tb_PhieuNCC.findOne({
    //   where: {
    //     iTinhtrang: 1,
    //     ID_Phieu1: ID_NoiXuat,
    //     isDelete: 0
    //   },
    //   transaction
    // });

    // // Nếu có phiếu phù hợp với điều kiện trên, báo lỗi và rollback transaction
    // if (existingRecord) {
    //   throw new Error('Phòng ban dự án phải khóa các phiếu cần tạo.');
    // }

    const [pccResults, tonkhos, taisanQrCodes] = await Promise.all([
      Tb_PhieuNCC.findAll({
        
        attributes: [
          "ID_Phieu1",
          "ID_Phieu2",
          "ID_Quy",
          "ID_Loainhom",
          "ID_Nghiepvu",
          "isDelete",
          // "ID_Nam",
        ],
        include: [
          {
            model: Tb_PhieuNCCCT,
            as: "tb_phieunccct",
            where: { isDelete: 0 },
            attributes: ["ID_Taisan", "Dongia", "Soluong", "isDelete", "Namsx"],
            include: [
              {
                model: Ent_Taisan,
                as: "ent_taisan",
                attributes: ["Tents", "ID_Nhomts", "isDelete"],
              },
            ],
          },
        ],
        where: whereCondition,
      }),

      Tb_Tonkho.findAll({
        where: {
          ID_Phongban: ID_NoiXuat,
          ID_Quy,
          isDelete: 0,
        },
        attributes: [
          "ID_Taisan",
          "TonSosach",
          "isDelete",
          "ID_Phongban",
          "ID_Quy",
        ],
      }),

      Tb_TaisanQrCode.findAll({
        where: {
          ID_Phongban: ID_NoiXuat,
          isDelete: 0,
        },
        attributes: [
          "ID_TaisanQrcode",
          "ID_Taisan",
          "MaQrCode",
          "isDelete",
          "ID_Phongban",
        ],
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

    // Biến đổi dữ liệu để mỗi mã QR code trở thành một tài sản riêng, nếu không có mã QR code thì trả về MaQrCode và ID_TaisanQrcode rỗng
    const resultWithQrCode = pccResults.flatMap((pcc) =>
      pcc.tb_phieunccct.flatMap((item) => {
        const qrCodes = qrCodeMap[item.ID_Taisan] || [];

        if (qrCodes.length > 0) {
          // Nếu có mã QR code, tạo ra mỗi tài sản với số lượng là 1 và mã QR code tương ứng
          return qrCodes.map((qrCode) => ({
            ID_Taisan: item.ID_Taisan,
            ID_TaisanQrcode: qrCode.ID_TaisanQrcode, // Lấy ID_TaisanQrcode từ qrCodes
            Dongia: item.Dongia,
            Soluong: 1,
            Namsx: item.Namsx,
            Tong: item.Dongia,
            isDelete: 0,
            isUpdate: 0,
            TonSosach: tonKhoMap[item.ID_Taisan] || 0,
            Tents: item.ent_taisan.Tents,
            MaQrCode: qrCode.MaQrCode, // Mỗi tài sản có một mã QR code
          }));
        } else {
          // Nếu không có mã QR code, trả về tài sản với MaQrCode và ID_TaisanQrcode là null
          return {
            ID_Taisan: item.ID_Taisan,
            ID_TaisanQrcode: null, // Không có mã QR code, nên ID_TaisanQrcode là null
            Dongia: item.Dongia,
            Soluong: item.Soluong, // Số lượng gốc của tài sản
            Tong: item.Dongia * item.Soluong,
            TonSosach: tonKhoMap[item.ID_Taisan] || 0,
            Tents: item.ent_taisan.Tents,
            MaQrCode: null, // Không có mã QR code
            Namsx: item.Namsx,
            isDelete: 0,
            isUpdate: 0,
          };
        }
      })
    );

    return resultWithQrCode;
  } catch (error) {
    console.error("Error fetching assets:", error);
    await transaction.rollback();
    throw error;
  }
};

const deleteTb_PhieuNCCCT = async (ID_PhieuNCC, transaction) => {
  const phieuNCC = await Tb_PhieuNCC.findByPk(ID_PhieuNCC);
  const phieuNCCCts = await Tb_PhieuNCCCT.findAll({
    where: {
      ID_PhieuNCC: ID_PhieuNCC,
      isDelete: 0,
    },
    transaction,
  });

  if (phieuNCC.ID_Nghiepvu != 2) {
    const taisanQrCodeIds = phieuNCCCts
      .filter((item) => item.ID_TaisanQrcode)
      .map((item) => item.ID_TaisanQrcode);

    if (taisanQrCodeIds.length > 0) {
      await Tb_TaisanQrCode.update(
        { isDelete: 1 },
        {
          where: { ID_TaisanQrcode: taisanQrCodeIds },
          transaction,
        }
      );
    }
  } else {
    const phieuNCCCtIds = phieuNCCCts.map((item) => item.ID_PhieuNCCCT);
    if (phieuNCCCtIds.length > 0) {
      await Tb_TaisanQrCode.update(
        { iTinhtrang: 0, isDelete: 0 },
        {
          where: { ID_PhieuNCCCT: phieuNCCCtIds },
          transaction,
        }
      );
    }
  }

  for (const item of phieuNCCCts) {
    const delta = -item.Soluong;
    await updateTonkho(item, phieuNCC, delta, transaction);
  }

  await Tb_PhieuNCCCT.update(
    { isDelete: 1 },
    {
      where: {
        ID_PhieuNCC: ID_PhieuNCC,
        isDelete: 0,
      },
      transaction,
    }
  );
};

module.exports = {
  create_PhieuNhapNCC,
  create_PhieuXuatNCC,
  getAllTb_PhieuNCCCT,
  updatePhieuNhapHangNCC,
  scanTb_PhieuNCCCT,
  getTaiSanPB,
  updatePhieuNCCCT,
  deleteTb_PhieuNCCCT,
};
