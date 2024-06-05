const Ent_Chinhanh = require('./ent_chinhanh.model')
const Ent_Connguoi = require('./ent_connguoi.model')
const Ent_Donvi = require('./ent_donvi.model')
const Ent_Nghiepvu = require('./ent_nghiepvu.model')
const Ent_Nhompb = require('./ent_nhompb.model')
const Ent_Nhomts = require('./ent_nhomts.model')
const Ent_Phongbanda = require('./ent_phongbanda.model')
const Ent_Taisan = require('./ent_taisan.model')
const Tb_TaisanQrCode = require('./tb_taisanqrcode.model')

// Con nguoi
Ent_Nhompb.hasMany(Ent_Connguoi);
Ent_Connguoi.belongsTo(Ent_Nhompb, {
  foreignKey: "ID_Nhompb",
});

// Nhom ban Da
Ent_Nhompb.hasMany(Ent_Phongbanda);
Ent_Phongbanda.belongsTo(Ent_Nhompb, {
  foreignKey: "ID_Nhompb",
});

Ent_Chinhanh.hasMany(Ent_Phongbanda);
Ent_Phongbanda.belongsTo(Ent_Chinhanh, {
  foreignKey: "ID_Chinhanh",
});

// Tai san
Ent_Donvi.hasMany(Ent_Taisan, { as: 'ent_taisan', foreignKey: 'ID_Donvi' });
Ent_Taisan.belongsTo(Ent_Donvi, {
  foreignKey: "ID_Donvi",
});

Ent_Nhomts.hasMany(Ent_Taisan, { as: 'ent_taisan', foreignKey: 'ID_Nhomts' });
Ent_Taisan.belongsTo(Ent_Nhomts, {
  foreignKey: "ID_Nhomts",
});

// Tai san Qr Code
Ent_Taisan.hasMany(Tb_TaisanQrCode, { as: 'tb_taisanqrcode', foreignKey: 'ID_Taisan' });
Tb_TaisanQrCode.belongsTo(Ent_Taisan, {
  foreignKey: "ID_Taisan",
});


module.exports = {
    Ent_Chinhanh,
    Ent_Connguoi,
    Ent_Donvi,
    Ent_Nghiepvu,
    Ent_Nhompb,
    Ent_Nhomts,
    Ent_Phongbanda,
    Ent_Taisan,
    Tb_TaisanQrCode,
  };
  