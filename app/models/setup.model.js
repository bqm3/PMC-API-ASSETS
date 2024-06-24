const Ent_Chinhanh = require('./ent_chinhanh.model')
const Ent_Connguoi = require('./ent_connguoi.model')
const Ent_Donvi = require('./ent_donvi.model')
const Ent_Nghiepvu = require('./ent_nghiepvu.model')
const Ent_Nhompb = require('./ent_nhompb.model')
const Ent_Nhomts = require('./ent_nhomts.model')
const Ent_Phongbanda = require('./ent_phongbanda.model')
const Ent_Policy = require('./ent_policy.model')
const Ent_User = require('./ent_user.model')
const Tb_TaisanQrCode = require('./tb_taisanqrcode.model')
const Ent_Nam = require('./ent_nam.models')
const Ent_Taisan = require('./ent_taisan.model')
const Ent_Thang = require('./ent_thang.model')
const Tb_NameField = require('./tb_namefield.model')
const Tb_PhieuNX = require('./tb_phieunx.model')
const Tb_PhieuNXCT = require('./tb_phieunxct.model')
const Tb_SuachuaCT = require('./tb_suachuact.model')
const Tb_SuachuaTS = require('./tb_suachuats.model')
const Ent_GroupPolicy = require('./ent_grouppolicy.model')
const Tb_Table = require('./tb_table.model')
const Ent_Chucvu = require('./ent_chucvu.model')

// User
Ent_Nhompb.hasMany(Ent_User, { as: 'Ent_User', foreignKey: 'ID_Nhompb' });
Ent_User.belongsTo(Ent_Nhompb, {
  foreignKey: "ID_Nhompb"
})

Ent_Chinhanh.hasMany(Ent_User, { as: 'Ent_User', foreignKey: 'ID_Chinhanh' });
Ent_User.belongsTo(Ent_Chinhanh, {
  foreignKey: "ID_Chinhanh"
})

// Con nguoi
Ent_Nhompb.hasMany(Ent_Connguoi);
Ent_Connguoi.belongsTo(Ent_Nhompb, {
  foreignKey: "ID_Nhompb",
});

// Nhom ban Da
Ent_Nhompb.hasMany(Ent_Phongbanda,  { as: 'ent_phongbanda', foreignKey: 'ID_Nhompb' });
Ent_Phongbanda.belongsTo(Ent_Nhompb, {
  foreignKey: "ID_Nhompb",
});

Ent_Chinhanh.hasMany(Ent_Phongbanda,  { as: 'ent_phongbanda', foreignKey: 'ID_Chinhanh' });
Ent_Phongbanda.belongsTo(Ent_Chinhanh, {
  foreignKey: "ID_Chinhanh",
});


// Policy
Ent_GroupPolicy.hasMany(Ent_Policy);
Ent_Policy.belongsTo(Ent_GroupPolicy, {
  foreignKey: "ID_GroupPolicy",
});


// NameField
Tb_Table.hasMany(Tb_NameField, { as: 'tb_namefield', foreignKey: 'ID_Table' });
Tb_NameField.belongsTo(Tb_Table, {
  foreignKey: "ID_Table",
});


// Phieu NX
Ent_Nghiepvu.hasMany(Tb_PhieuNX, { as: 'tb_phieunx', foreignKey: 'ID_Nghiepvu' });
Tb_PhieuNX.belongsTo(Ent_Nghiepvu, {
  foreignKey: "ID_Nghiepvu",
});

Ent_User.hasMany(Tb_PhieuNX, { as: 'tb_phieunx', foreignKey: 'ID_User' });
Tb_PhieuNX.belongsTo(Ent_User, {
  foreignKey: "ID_User",
});

Ent_Thang.hasMany(Tb_PhieuNX, { as: 'tb_phieunx', foreignKey: 'ID_Thang' });
Tb_PhieuNX.belongsTo(Ent_Thang, {
  foreignKey: "ID_Thang",
});

Ent_Nam.hasMany(Tb_PhieuNX, { as: 'tb_phieunx', foreignKey: 'ID_Nam' });
Tb_PhieuNX.belongsTo(Ent_Nam, {
  foreignKey: "ID_Nam",
});

// Thiết lập quan hệ cho nơi nhập
Ent_Phongbanda.hasMany(Tb_PhieuNX, { foreignKey: 'ID_NoiNhap', as: 'NhapPhieuNX' });
Tb_PhieuNX.belongsTo(Ent_Phongbanda, { foreignKey: 'ID_NoiNhap', as: 'NoiNhap' });

// Thiết lập quan hệ cho nơi xuất
Ent_Phongbanda.hasMany(Tb_PhieuNX, { foreignKey: 'ID_NoiXuat', as: 'XuatPhieuNX' });
Tb_PhieuNX.belongsTo(Ent_Phongbanda, { foreignKey: 'ID_NoiXuat', as: 'NoiXuat' });




// Phieu NXCT
Tb_PhieuNX.hasMany(Tb_PhieuNXCT, { as: 'tb_phieunxct', foreignKey: 'ID_PhieuNX' });
Tb_PhieuNXCT.belongsTo(Tb_PhieuNX, {
  foreignKey: "ID_PhieuNX",
});

Ent_Taisan.hasMany(Tb_PhieuNXCT, { as: 'tb_phieunxct', foreignKey: 'ID_Taisan' });
Tb_PhieuNXCT.belongsTo(Ent_Taisan, {
  foreignKey: "ID_Taisan",
});


// Sua chua CT
Tb_SuachuaTS.hasMany(Tb_SuachuaCT, { as: 'tb_suachuact', foreignKey: 'ID_SuachuaTS' });
Tb_SuachuaCT.belongsTo(Tb_SuachuaTS, {
  foreignKey: "ID_SuachuaTS", as: 'tb_suachuact'
});

Tb_TaisanQrCode.hasMany(Tb_SuachuaCT, { as: 'tb_suachuact', foreignKey: 'ID_TaisanQr' });
Tb_SuachuaCT.belongsTo(Tb_TaisanQrCode, { foreignKey: 'ID_TaisanQr', as: 'tb_taisanqr' });


// Tai san
Ent_Donvi.hasMany(Ent_Taisan, { as: 'ent_taisan', foreignKey: 'ID_Donvi' });
Ent_Taisan.belongsTo(Ent_Donvi, {
  foreignKey: "ID_Donvi",
});

Ent_Nhomts.hasMany(Ent_Taisan, { as: 'ent_taisan', foreignKey: 'ID_Nhomts' });
Ent_Taisan.belongsTo(Ent_Nhomts, {
  foreignKey: "ID_Nhomts", as: 'ent_nhomts'
});

// User
Ent_Nhompb.hasMany(Ent_User, { as: 'ent_user', foreignKey: 'ID_Nhompb' })
Ent_User.belongsTo(Ent_Nhompb, {
  foreignKey: "ID_Nhompb"
})

Ent_Chinhanh.hasMany(Ent_User, { as: 'ent_user', foreignKey: 'ID_Chinhanh' })
Ent_User.belongsTo(Ent_Chinhanh, {
  foreignKey: "ID_Chinhanh"
})

// Table
Ent_GroupPolicy.hasMany(Tb_Table, { as: 'tb_table', foreignKey: 'ID_GroupPolicy' });
Tb_Table.belongsTo(Ent_GroupPolicy, {
  foreignKey: "ID_GroupPolicy",
});


// Tai san Qr Code
Ent_Taisan.hasMany(Tb_TaisanQrCode, { as: 'tb_taisanqr', foreignKey: 'ID_Taisan' });
Tb_TaisanQrCode.belongsTo(Ent_Taisan, {
  foreignKey: "ID_Taisan",
});

Ent_Nam.hasMany(Tb_TaisanQrCode, { as: 'tb_taisanqr', foreignKey: 'ID_Nam' });
Tb_TaisanQrCode.belongsTo(Ent_Nam, {
  foreignKey: "ID_Nam",
});

Ent_Thang.hasMany(Tb_TaisanQrCode, { as: 'tb_taisanqr', foreignKey: 'ID_Thang' });
Tb_TaisanQrCode.belongsTo(Ent_Thang, {
  foreignKey: "ID_Thang",
});

Ent_Phongbanda.hasMany(Tb_TaisanQrCode, { as: 'tb_taisanqr', foreignKey: 'ID_Phongban' });
Tb_TaisanQrCode.belongsTo(Ent_Phongbanda, {
  foreignKey: "ID_Phongban",
});

Ent_User.hasMany(Tb_TaisanQrCode, { as: 'tb_taisanqr', foreignKey: 'ID_User' });
Tb_TaisanQrCode.belongsTo(Ent_User, {
  foreignKey: "ID_User",
});


// Chucvu
Ent_Chucvu.hasMany(Ent_User, { as: 'ent_user', foreignKey: 'ID_Chucvu' })
Ent_User.belongsTo(Ent_Chucvu, {
  foreignKey: "ID_Chucvu",
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
    Ent_User,
    Tb_TaisanQrCode,
    Ent_Thang,
    Ent_Nam,
    Tb_PhieuNX,
    Tb_PhieuNXCT,
    Tb_SuachuaCT,
    Tb_SuachuaTS,
    Tb_Table,
    Ent_Chucvu,
    Ent_GroupPolicy, Ent_Policy
  };
  