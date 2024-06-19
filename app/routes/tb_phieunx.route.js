module.exports = (app) => {
    const tb_phieunx = require("../controllers/tb_phieunx.controller.js");
    const { isAuthenticated } = require("../middleware/auth.middleware.js");
    const { isRole } = require("../middleware/isRole.middleware.js");
  
    var router = require("express").Router();
  
    router.post(
      "/create",
      [isAuthenticated, isRole],
      tb_phieunx.createTb_PhieuNX
    );
    router.get("/all", tb_phieunx.getAllTb_PhieuNX);
    router.put(
      "/update/:id",
      [isAuthenticated, isRole],
      tb_phieunx.updateTb_PhieuNX
    );
    router.put(
      "/delete/:id",
      [isAuthenticated, isRole],
      tb_phieunx.deleteTb_PhieuNX
    );
  
    app.use("/api/tb_phieunx", router);
  };
  