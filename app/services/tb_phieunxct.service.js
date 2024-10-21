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
  Tb_Tonkho,
  Tb_TaisanQrCode,
  Tb_PhieuNX,
} = require("../models/setup.model");
const sequelize = require("../config/db.config");
const { Op, where, Sequelize } = require("sequelize");
const { getDuanVsTaisanDetails } = require("./create_qr_code.service");

const createTb_PhieuNXCT = async (phieunxct, data) => {
  const groupedItems = {};

  // Group by ID_Taisan and sum Soluong
  phieunxct.forEach((item) => {
    const { ID_Taisan, Dongia, Soluong, Namsx } = item;
    if (!groupedItems[ID_Taisan]) {
      groupedItems[ID_Taisan] = {
        ID_Taisan,
        Namsx,
        Dongia: Number(Dongia),
        Soluong: Number(Soluong),
      };
    } else {
      groupedItems[ID_Taisan].Soluong += Number(Soluong);
    }
  });

  const ID_PhieuNXCT_Items = [];

  // Bulk insert into Tb_PhieuNXCT
  await Promise.all(
    Object.values(groupedItems).map(async (groupedItem) => {
      const newPhieuNXCT = await Tb_PhieuNXCT.create({
        ID_PhieuNX: data.ID_PhieuNX,
        ID_Taisan: groupedItem.ID_Taisan,
        Dongia: groupedItem.Dongia,
        Namsx: groupedItem.Namsx,
        Soluong: groupedItem.Soluong,
        isDelete: 0,
      });
      ID_PhieuNXCT_Items.push({
        ID_Taisan: groupedItem.ID_Taisan,
        ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT,
      });
    })
  );

  // Process based on ID_Nghiepvu
  if ([1, 9].includes(data.ID_Nghiepvu)) {
    for (const item of Object.values(groupedItems)) {
      const { ID_Taisan, Namsx } = item;

      // Find Taisan once and handle both Nghiepvu 1 and 9
      const taisan = await Ent_Taisan.findOne({
        where: { ID_Taisan, isDelete: 0 },
        attributes: ["ID_Taisan", "i_MaQrCode", "isDelete"],
      });

      if (!taisan) {
        console.log(`Không tìm thấy tài sản với ID_Taisan: ${ID_Taisan}`);
        continue;
      }

      // Process based on Nghiepvu ID
      if (data.ID_Nghiepvu === 1) {
        if (taisan.i_MaQrCode === 0) {
          await handleQrCodeCreation(
            ID_Taisan,
            item,
            ID_PhieuNXCT_Items,
            data,
            Namsx
          );
        }

        await updateOrInsertTonKho(
          item,
          data,
          `Tondau + ${item.Soluong}`,
          `Tientondau + ${item.Dongia * item.Soluong}`
        );
      }

      if (data.ID_Nghiepvu === 9) {
        await updateOrInsertTonKho(item, data, item.Soluong, null, true);
      }
    }
  }
};

// Utility function to create QR code entries
const handleQrCodeCreation = async (
  ID_Taisan,
  item,
  ID_PhieuNXCT_Items,
  data,
  Namsx
) => {
  const matchedItem = ID_PhieuNXCT_Items.find(
    (itm) => itm.ID_Taisan === ID_Taisan
  );
  const ID_PhieuNXCT = matchedItem ? matchedItem.ID_PhieuNXCT : null;

  const [duan, taisanDetails] = await getDuanVsTaisanDetails(
    data.ID_NoiNhap,
    ID_Taisan
  );

  const Thuoc = duan?.Thuoc;
  const ManhomTs = taisanDetails.ent_nhomts.Manhom;
  const MaID = taisanDetails.ID_Taisan;
  const MaTaisan = taisanDetails.Mats;
  const Ngay = formatDateTime(data.NgayNX);

  const createQrCodeEntry = async (index) => {
    const MaQrCode =
      index > 1
        ? `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}`
        : `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}`;

    await Tb_TaisanQrCode.create({
      ID_Nam: data.ID_Nam,
      ID_Quy: data.ID_Quy,
      ID_Taisan: ID_Taisan,
      ID_PhieuNXCT: ID_PhieuNXCT,
      ID_Phongban: data.ID_NoiNhap,
      Giatri: item.Dongia,
      Ngaykhoitao: data.NgayNX,
      MaQrCode: MaQrCode,
      Namsx: Namsx,
      iTinhtrang: 0,
    });
  };

  // Create multiple QR codes if needed
  const qrCodePromises = [];
  for (let i = 1; i <= Number(item.Soluong); i++) {
    qrCodePromises.push(createQrCodeEntry(i));
  }
  await Promise.all(qrCodePromises);

  console.log(
    `Lưu vào bảng Tb_TaisanQrcode thành công cho ID_Taisan: ${ID_Taisan}`
  );
};

// Utility function to update or insert TonKho data
const updateOrInsertTonKho = async (
  item,
  data,
  tondauUpdate,
  tientondauUpdate = null,
  isKiemke = false
) => {
  try {
    const tonkho = await Tb_Tonkho.findOne({
      where: {
        ID_Taisan: item.ID_Taisan,
        ID_Nam: data.ID_Nam,
        ID_Thang: data.ID_Thang,
        ID_Quy: data.ID_Quy,
        ID_Phongban: data.ID_NoiNhap,
        isDelete: 0,
      },
    });

    if (tonkho) {
      const updateFields = {
        Tondau: Sequelize.literal(tondauUpdate),
      };

      if (tientondauUpdate) {
        updateFields.Tientondau = Sequelize.literal(tientondauUpdate);
      }

      if (isKiemke) {
        updateFields.Kiemke = item.Soluong;
      }

      await Tb_Tonkho.update(updateFields, {
        where: {
          ID_Taisan: item.ID_Taisan,
          ID_Nam: data.ID_Nam,
          ID_Quy: data.ID_Quy,
          ID_Thang: data.ID_Thang,
          ID_Phongban: data.ID_NoiNhap,
          isDelete: 0,
        },
      });
    } else {
      await Tb_Tonkho.create({
        ID_Taisan: item.ID_Taisan,
        ID_Nam: data.ID_Nam,
        ID_Quy: data.ID_Quy,
        ID_Thang: data.ID_Thang,
        ID_Phongban: data.ID_NoiNhap,
        Tondau: item.Soluong,
        Tientondau: item.Dongia * item.Soluong,
        Kiemke: isKiemke ? item.Soluong : null,
        isDelete: 0,
      });
    }
  } catch (error) {
    throw new Error("Lỗi khi lưu thông tin vào tồn kho");
  }
};

const updateTb_PhieuNXCT = async (phieunxct, ID_PhieuNX, reqData) => {
  const transaction = await sequelize.transaction();
  try {
    const groupedItems = {};
    let ID_PhieuNXCT_Items = [];

    // Group items by ID_Taisan
    phieunxct.forEach((item) => {
      const { ID_Taisan, Dongia, Soluong, ID_PhieuNXCT, Namsx, isDelete } =
        item;
      if (!groupedItems[ID_Taisan]) {
        groupedItems[ID_Taisan] = { ID_Taisan, Namsx, items: [] };
      }
      groupedItems[ID_Taisan].items.push({
        ID_PhieuNXCT,
        Dongia,
        Soluong,
        Namsx,
        isDelete,
      });
    });

    // Fetch necessary data in parallel
    const [currentItems, phieunx] = await Promise.all([
      Tb_PhieuNXCT.findAll({ where: { ID_PhieuNX, isDelete: 0 }, transaction }),
      Tb_PhieuNX.findOne(
        {
          where: { ID_PhieuNX, isDelete: 0 },
          attributes: [
            "ID_PhieuNX",
            "isDelete",
          ],
        },
        transaction
      ),
    ]);

    const { ID_NoiNhap, ID_Nam, ID_Quy, ID_Thang } = phieunx?.dataValues || {};

    // Find items to delete
    const currentItemIds = currentItems.map((item) => item.ID_PhieuNXCT);
    const newItemIds = phieunxct
      .filter((item) => item.ID_PhieuNXCT)
      .map((item) => item.ID_PhieuNXCT);
    const itemsToDelete = currentItemIds.filter(
      (id) => !newItemIds.includes(id)
    );

    // Delete removed items and related QR codes in bulk
    if (itemsToDelete.length > 0) {
      await Promise.all([
        Tb_PhieuNXCT.update(
          {
            isDelete: 1
          },
          {
          where: { ID_PhieuNXCT: itemsToDelete },
          
          transaction,
        }),
        Tb_TaisanQrCode.update(
          {
            isDelete: 2
          },
          {
          where: { ID_PhieuNXCT: itemsToDelete },
          transaction,
        }),
      ]);
    }

    const updatePromises = [];

    // Helper function to update/create QR codes
    const handleQrCodes = async (
      taisan,
      matchedItem,
      Dongia,
      Soluong,
      reqData,
      isDelete
    ) => {
      const [duan, taisanDetails] = await getDuanVsTaisanDetails(
        ID_NoiNhap,
        taisan.ID_Taisan
      );
      const Thuoc = duan?.Thuoc;
      const ManhomTs = taisanDetails.ent_nhomts.Manhom;
      const MaID = taisanDetails.ID_Taisan;
      const MaTaisan = taisanDetails.Mats;
      const Ngay = formatDateTime(reqData.NgayNX);

      const createQrCodeEntry = async (index) => {
        const MaQrCode = `${Thuoc}|${ManhomTs}|${MaID}|${MaTaisan}|${Ngay}|${index}`;

        await Tb_TaisanQrCode.create(
          {
            ID_Nam,
            ID_Quy,
            ID_Taisan: taisan.ID_Taisan,
            ID_PhieuNXCT: matchedItem.ID_PhieuNXCT,
            ID_Phongban: ID_NoiNhap,
            Giatri: Dongia,
            Ngaykhoitao: reqData.NgayNX,
            MaQrCode,
            Namsx: matchedItem.Namsx,
            Ghichu: "",
            iTinhtrang: 0,
            isDelete: isDelete,
          },
          { transaction }
        );
      };

      // Create QR codes based on quantity
        for (let i = 1; i <= Soluong; i++) {
          await createQrCodeEntry(i);
        }
    };

    // Process grouped items
    for (const group of Object.values(groupedItems)) {
      const { ID_Taisan, items } = group;

      for (const item of items) {
        const { ID_PhieuNXCT, Dongia, Soluong, isDelete } = item;

        if (ID_PhieuNXCT) {
          // Update existing record
          updatePromises.push(
            Tb_PhieuNXCT.update(
              {
                ID_PhieuNX,
                ID_Taisan,
                Dongia,
                Soluong,
                Namsx: item.Namsx,
                isDelete,
              },
              { where: { ID_PhieuNXCT }, transaction }
            )
          );

          ID_PhieuNXCT_Items.push({ ID_Taisan, ID_PhieuNXCT });

          // Update Tb_Tonkho
          await Tb_Tonkho.update(
            { Tondau: Soluong, Tientondau: Dongia * Soluong },
            {
              where: {
                ID_Taisan,
                ID_Nam,
                ID_Thang,
                ID_Quy,
                ID_Phongban: ID_NoiNhap,
              },
              transaction,
            }
          );

          const taisan = await Ent_Taisan.findOne({
            where: { ID_Taisan, isDelete: 0 },
            attributes: ["ID_Taisan", "i_MaQrCode"],
            transaction,
          });

          // Handle QR codes
          if (taisan?.i_MaQrCode === 0) {
            await Tb_TaisanQrCode.destroy({
              where: {
                ID_Taisan,
                ID_PhieuNXCT,
              },
              transaction,
            });
            await handleQrCodes(
              taisan,
              { ID_PhieuNXCT, Namsx: item.Namsx },
              Dongia,
              Soluong,
              reqData,
              2
            );
          }
        } else {
          // Create new record
          const newPhieuNXCT = await Tb_PhieuNXCT.create(
            {
              ID_PhieuNX,
              ID_Taisan,
              Dongia,
              Soluong,
              Namsx: item.Namsx,
              isDelete: 0,
            },
            { transaction }
          );
          ID_PhieuNXCT_Items.push({
            ID_Taisan,
            ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT,
          });

          // Insert into Tb_Tonkho
          await Tb_Tonkho.create(
            {
              ID_Taisan,
              ID_Nam,
              ID_Thang,
              ID_Quy,
              ID_Phongban: ID_NoiNhap,
              Tondau: Soluong,
              Tientondau: Dongia * Soluong,
            },
            { transaction }
          );

          const taisan = await Ent_Taisan.findOne({
            where: { ID_Taisan, isDelete: 0 },
            attributes: ["ID_Taisan", "i_MaQrCode"],
            transaction,
          });

          // Handle QR codes for new record
          if (taisan?.i_MaQrCode === 0) {
            await handleQrCodes(
              taisan,
              { ID_PhieuNXCT: newPhieuNXCT.ID_PhieuNXCT, Namsx: item.Namsx },
              Dongia,
              Soluong,
              reqData,
              0
            );
          }
        }
      }
    }

    // Execute bulk updates and commit
    await Promise.all(updatePromises);
    await transaction.commit();
    return true;
  } catch (error) {
    console.error("Error in updateTb_PhieuNXCT:", error);
    await transaction.rollback();
    return false;
  }
};

const getAllTb_PhieuNXCT = async () => {
  // Điều kiện để lấy các bản ghi không bị XCTóa
  let whereClause = {
    isDelete: 0,
  };

  // Thực hiện truy vấn với Sequelize
  const res = await Tb_PhieuNXCT.findAll({
    attributes: [
      "ID_PhieuNXCT",
      "ID_PhieuNX",
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

const scanTb_PhieuNXCT = async (data) => {
  const file = await uploadFile(data.images);
  const res = await Tb_PhieuNXCT.create({
    Anhts: file ? file.id : "",
    ID_TaisanQrcode: data.ID_TaisanQrcode,
    ID_PhieuNX: data.ID_PhieuNX,
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
  ID_Loainhom,
) => {
  const whereCondition = {
    ID_NoiNhap,
    ID_NoiXuat,
    ID_Quy,
    ID_Loainhom,
    isDelete: 0,
  };

  console.log('whereCondition', whereCondition)

  try {
    const [pccResults, tonkhos, taisanQrCodes] = await Promise.all([
      Tb_PhieuNX.findAll({
        where: whereCondition,
        include: [
          {
            model: Tb_PhieuNXCT,
            as: "tb_phieunxct",
            where: { isDelete: 0 },
            attributes: ["ID_Taisan", "Dongia", "Soluong", "isDelete"],
            include: [
              {
                model: Ent_Taisan,
                as: "ent_taisan",
                attributes: ["ID_Taisan", "Tents", "ID_Nhomts", "isDelete"],
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
        attributes: ["ID_Taisan", "TonSosach", "isDelete", "ID_Phongban", "ID_Quy"],
      }),

      Tb_TaisanQrCode.findAll({
        where: {
          ID_Phongban: ID_NoiXuat,
          isDelete: 0,
        },
        attributes: ["ID_TaisanQrcode", "ID_Taisan", "MaQrCode", "isDelete" , "ID_Phongban"],
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

    // Adjust logic to create a new asset entry for each QR code
    const resultWithQrCode = pccResults.flatMap((pcc) =>
      pcc.tb_phieunxct.flatMap((item) => {
        const qrCodes = qrCodeMap[item.ID_Taisan] || [];
        if (qrCodes.length > 0) {
          // Return a new asset entry for each QR code
          return qrCodes.map((qrCode) => ({
            ID_Taisan: item.ID_Taisan,
            Dongia: item.Dongia,
            Soluongnhap: item.Soluong,
            TonSosach: tonKhoMap[item.ID_Taisan] || 0,
            Tents: item.ent_taisan.Tents,
            ent_taisanqrcode: [qrCode],
          }));
        } else {
          // If no QR codes, return a single asset entry
          return {
            ID_Taisan: item.ID_Taisan,
            Dongia: item.Dongia,
            Soluongnhap: item.Soluong,
            TonSosach: tonKhoMap[item.ID_Taisan] || 0,
            Tents: item.ent_taisan.Tents,
            ent_taisanqrcode: [],
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

module.exports = {
  createTb_PhieuNXCT,
  getAllTb_PhieuNXCT,
  updateTb_PhieuNXCT,
  scanTb_PhieuNXCT,
  getTaiSanPB
};

function formatDateTime(data) {
  const date = new Date(data); // Chuyển chuỗi thành đối tượng Date

  if (isNaN(date)) {
    throw new Error("Invalid date value");
  }

  const year = date.getFullYear().toString().slice(2); // Lấy 2 số cuối của năm
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng 2 chữ số
  const day = date.getDate().toString().padStart(2, "0"); // Ngày 2 chữ số

  return `${year}${month}${day}`;
}
