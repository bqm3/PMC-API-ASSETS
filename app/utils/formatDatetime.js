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

module.exports = formatDateTime;