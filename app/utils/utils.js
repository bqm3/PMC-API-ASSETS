const removeVietnameseTones = (str) => {
  str = str.replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Convert 'đ' to 'd'
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};


module.exports = {
    removeVietnameseTones,
};