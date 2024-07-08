const multer = require("multer");
const upload = multer();

module.exports = (app) => {
  const tb_taisanqrcode = require("../controllers/tb_taisanqrcode.controller.js");
  const {isAuthenticated}= require('../middleware/auth.middleware.js');

  var router = require("express").Router();

  
  router.post("/create", tb_taisanqrcode.createTb_Taisanqrcode);
  router.get("/all", tb_taisanqrcode.getAllTb_Taisanqrcode);
  router.get("/:id", tb_taisanqrcode.getDetailTb_Taisanqrcode);
  router.put("/update/:id", tb_taisanqrcode.updateleTb_Taisanqrcode);
  router.put("/delete/:id", tb_taisanqrcode.deleteTb_Taisanqrcode);
  router.post(
    "/scan/:id",
    [isAuthenticated, upload.single("Image")],
    tb_taisanqrcode.scanQrCodeTb_Taisanqrcode
  );


  app.use("/api/tb_taisanqrcode", router);
};
