const multer = require("multer");
const upload = multer();

module.exports = (app) => {
    const tb_phieunxct = require("../controllers/tb_phieunxct.controller.js");
    const { isAuthenticated } = require("../middleware/auth.middleware.js");
    const { isRole } = require("../middleware/isRole.middleware.js");
  
    var router = require("express").Router();
  
    router.post(
      "/scan",
      [isAuthenticated, upload.single("Image")],
      tb_phieunxct.scanQrCodeTb_PhieuNXCT
    );
    // router.get("/all", tb_phieunxct.getAllTb_PhieuNXCT);
  
    app.use("/api/tb_phieunxct", router);
  };
  