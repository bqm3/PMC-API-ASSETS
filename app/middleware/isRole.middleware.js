const asyncHandler = require("express-async-handler");
const isRole = asyncHandler((req, res, next) => {
  const { ID_Chucvu } = req.user.data;
  if (ID_Chucvu !== 1 && ID_Chucvu !== 2)
    return res.status(401).json({
      success: false,
      message: "Không có quyền truy cập",
    });
  next();
});

module.exports = { isRole };
