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
// ================================ Tạo mới
//phiếu 6.1.2 nhập hàng từ nhà cung cấp
// 2 Nhập hàng từ nhà cung cấp
const create_PhieuNhapNCC = async (phieunxct, data, transaction) => {
  const groupedItems = {};
  let ID_PhieuNXCT_Items = [];

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
    groupedItems[ID_Taisan].Dongia = Number(Dongia);
    groupedItems[ID_Taisan].Soluong += Number(Soluong);
  });

    // Tạo bản ghi trong Tb_PhieuNCCCT
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
    }))

  // Kiểm tra nếu ID_PhieuNXCT_Items có giá trị đúng
  
  // Tiếp tục các thao tác với Tonkho
  const tonkhoItems = await Tb_Tonkho.findAll({
    where: {
      ID_Phongban: data.ID_Phongban,
      ID_Nam: data.ID_Nam,
      ID_Quy: data.ID_Quy,
      ID_Taisan: Object.keys(groupedItems),
    },
    transaction,
  });

  const tonkhoMap = {};
  tonkhoItems.forEach((item) => {
    tonkhoMap[item.ID_Taisan] = item;
  });
  
  // Cập nhật hoặc tạo mới bản ghi trong Tb_Tonkho
  const tonkhoPromises = Object.values(groupedItems).map(async (groupedItem) => {
    const existingTonkho = tonkhoMap[groupedItem.ID_Taisan];

    if (existingTonkho) {
      const TonSosach =
        existingTonkho.Tondau +
        existingTonkho.Nhapngoai +
        groupedItem.Soluong +
        existingTonkho.Nhapkhac +
        existingTonkho.NhapNB -
        existingTonkho.XuatNB -
        existingTonkho.XuattraNCC -
        existingTonkho.XuatThanhly -
        existingTonkho.XuatHuy -
        existingTonkho.XuatgiaoNV;

      // Cập nhật nếu đã tồn tại
      await Tb_Tonkho.update(
        {
          Nhapngoai: existingTonkho.Nhapngoai + groupedItem.Soluong,
          Tiennhapngoai:
            existingTonkho.Tiennhapngoai +
            groupedItem.Dongia * groupedItem.Soluong,
          TonSosach,
        },
        {
          where: {
            ID_Phongban: data.ID_Phieu1,
            ID_Nam: data.ID_Nam,
            ID_Quy: data.ID_Quy,
            ID_Taisan: groupedItem.ID_Taisan,
            isDelete: 0,
          },
          transaction,
        }
      );
    } else {
      const TonSosach =
        0 + 
        groupedItem.Soluong +
        0 + 
        0 - 
        0 -
        0 -
        0 -
        0;

      // Tạo mới nếu không tồn tại
      await Tb_Tonkho.create(
        {
          ID_Taisan: groupedItem.ID_Taisan,
          ID_Nam: data.ID_Nam,
          ID_Quy: data.ID_Quy,
          ID_Thang: data.ID_Thang,
          ID_Phongban: data.ID_Phieu1,
          Nhapngoai: groupedItem.Soluong,
          Tiennhapngoai: groupedItem.Dongia * groupedItem.Soluong,
          TonSosach,
          isDelete: 0,
        },
        { transaction }
      );
    }
  });
  await Promise.all(tonkhoPromises);

  // Xử lý tạo mã QR
  const taisanIds = Object.keys(groupedItems);
  const taisans = await Ent_Taisan.findAll({
    where: {
      ID_Taisan: taisanIds,
      isDelete: 0,
    },
    attributes: ["ID_Taisan", "i_MaQrCode", "isDelete"],
    transaction,
  });

  const createQrPromises = taisans.map(async (taisan) => {
    if (Number(taisan.i_MaQrCode) === 0) {
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

      const qrCodes = [];
      for (let i = 1; i <= Number(groupedItems[taisan.ID_Taisan].Soluong); i++) {
        qrCodes.push({
          ID_Nam: data.ID_Nam,
          ID_Quy: data.ID_Quy,
          ID_Taisan: foundItem.ID_Taisan,
          ID_PhieuNCCCT: foundItem.ID_PhieuNCCCT,
          ID_Phongban: data.ID_Phieu1,
          Giatri: groupedItems[taisan.ID_Taisan].Dongia,
          Ngaykhoitao: data.NgayNX,
          MaQrCode: `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${i}`,
          Namsx: groupedItems[taisan.ID_Taisan].Namsx,
          Nambdsd: null,
          Ghichu: "",
          iTinhtrang: 0,
        });
      }
      await Tb_TaisanQrCode.bulkCreate(qrCodes, { transaction });
    }
  });
  await Promise.all(createQrPromises);

  console.log("run ");
};

// 5 Xuat tra ncc
// 6 xuat thanh ly
// 7 Xuat huy
const create_PhieuXuatNCC = async (item, data, transaction) => {
  if (item.ID_TaisanQrcode !== null) {
    console.log('item.ID_TaisanQrcode', item.ID_TaisanQrcode)
    const checkUserTaisan = await Tb_TaisanQrCode.findOne(
      {
        attributes: ["ID_TaisanQrcode", "ID_User", "isDelete"],
        where: {
          isDelete: 0,
          ID_TaisanQrcode: item.ID_TaisanQrcode
        }, 
      },
      transaction
    );
    console.log('checkUserTaisan', checkUserTaisan)

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

  let updateTonkho = {};
  switch (Number(data.ID_Nghiepvu)) {
    case 5:
      updateTonkho = {
        XuattraNCC: Sequelize.literal(`XuattraNCC + ${item.Soluong}`),
        TonSosach: Sequelize.literal(
          `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
        ),
      };
      break;
    case 6:
      updateTonkho = {
        XuatThanhly: Sequelize.literal(`XuatThanhly + ${item.Soluong}`),
        TonSosach: Sequelize.literal(
          `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
        ),
      };
      break;
    case 7:
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
      // ID_Nam: data.ID_Nam,
      ID_Quy: data.ID_Quy,
      isDelete: 0,
    },
    transaction,
  });
  console.log(updatedRowCount)

  if (updatedRowCount === 0) {
    throw new Error(`Số lượng không hợp lệ cho ID_Taisan: ${item.ID_Taisan}`);
  }
};
// những dự án đã triển khai, những dự án nào chỉ mới kê khai, những khối nào đã triển khai của dự án 

// ================================= Cập nhật
// 6.1.2 Cập nhập phiếu nhập hàng từ nhà cung cấp
const updatePhieuNhapHangNCC = async (phieunxct, ID_PhieuNCC, data, transaction) => {
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
    //10 dữ liệu
    const currentItems = await Tb_PhieuNCCCT.findAll({
      where: { ID_PhieuNCC },
      transaction,
    });

    //phieunxct có 10 truyền xuống.
    //Th1: Truyền < 10, > 10
    // Get the list of IDs from the current items
    const currentItemIds = currentItems.map((item) => item.ID_PhieuNCCCT);

    const itemsMarkedForDeletion = phieunxct
      .filter((item) => item.ID_PhieuNCCCT && item.isDelete === 1)
      .map((item) => item.ID_PhieuNCCCT);

    const itemsToDelete = currentItemIds.filter((id) =>
      itemsMarkedForDeletion.includes(id)
    );

    // If there are items to delete, remove them from the database
    if (itemsToDelete.length > 0) {
      await Tb_PhieuNCCCT.update(
        {
          isDelete: 1,
        },
        {
          where: { ID_PhieuNCCCT: itemsToDelete },
          transaction,
        }
      );
    }

    // Cập nhật hoặc tạo mới các bản ghi
    await Promise.all(
      Object.values(groupedItems).map(async (groupedItem) => {
        const existingItem = currentItems.find(
          (item) => item.ID_Taisan == groupedItem.ID_Taisan
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
                isDelete: 0,
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
                    isDelete: 0,
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
                  isDelete: 0,
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
              attributes: ["ID_Taisan", "i_MaQrCode", "isDelete"],
              transaction,
            });

            if (taisan?.i_MaQrCode == 0) {
              await Tb_TaisanQrCode.update(
                {
                  isDelete: 2,
                },
                {
                  where: {
                    ID_Taisan: groupedItem.ID_Taisan,
                    ID_PhieuNCCCT: newPhieuCCCCT.ID_PhieuNCCCT,
                    isDelete: 0,
                  },
                  transaction,
                }
              );

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

    // await transaction.commit();
    return true;
  } catch (error) {
    // await transaction.rollback();
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
    throw new Error(error.message || "Có lỗi xảy ra khi cập nhật phiếu NCCCT.");
  }
};

const updateTonkho = async (item, reqData, Soluong, transaction) => {
  let tonkho = {};
  switch (Number(reqData.ID_Nghiepvu)) {
    case 2:
      tonkho = {
        Nhapngoai: Sequelize.literal(`Nhapngoai + ${Soluong}`),
        Tiennhapngoai: Sequelize.literal(
          `Tiennhapngoai + ${Soluong}*${item.Dongia}`
        ),
        TonSosach: Sequelize.literal(
          `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
        ),
      };
      break;
    case 5:
      tonkho = {
        XuattraNCC: Sequelize.literal(`XuattraNCC + ${Soluong}`),
        TonSosach: Sequelize.literal(
          `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
        ),
      };
      break;
    case 6:
      tonkho = {
        XuatThanhly: Sequelize.literal(`XuatThanhly + ${Soluong}`),
        TonSosach: Sequelize.literal(
          `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
        ),
      };
      break;
    case 7:
      tonkho = {
        XuatHuy: Sequelize.literal(`XuatHuy + ${Soluong}`),
        TonSosach: Sequelize.literal(
          `Tondau + Nhapngoai + Nhapkhac + NhapNB - XuatNB - XuattraNCC - XuatThanhly - XuatHuy - XuatgiaoNV`
        ),
      };
      break;
    default:
      throw new Error("Lỗi khi update tồn kho");
  }
  await Tb_Tonkho.update(tonkho, {
    where: {
      ID_Taisan: item.ID_Taisan,
      ID_Phongban: reqData.ID_Phieu1,
      TonSosach: { [Op.gte]: item.Soluong },
      ID_Nam: reqData.ID_Nam,
      ID_Quy: reqData.ID_Quy,
      isDelete: 0,
    },
    transaction,
  });
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
  ID_Loainhom
) => {
  const whereCondition = {
    ID_Phieu1: ID_NoiXuat,
    ID_Quy,
    // ID_Nam,
    ID_Loainhom,
    isDelete: 0,
  };

  try {
    const [pccResults, tonkhos, taisanQrCodes] = await Promise.all([
      Tb_PhieuNCC.findAll({
        where: whereCondition,
        attributes: [
          "ID_Phieu1",
          "ID_Phieu2",
          "ID_Quy",
          "ID_Loainhom",
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
        { isDelete: 1 },
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
