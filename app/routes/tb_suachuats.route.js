module.exports = (app) => {
    const tb_suachuats = require("../controllers/tb_suachuats.controller.js");
    const { isAuthenticated } = require("../middleware/auth.middleware.js");
    const { isRole } = require("../middleware/isRole.middleware.js");
  
    var router = require("express").Router();
  
    router.post(
      "/create",
      [isAuthenticated, isRole],
      tb_suachuats.createTb_Suachuats
    );
    router.get("/all", tb_suachuats.getAllTb_Suachuats);
    router.get(
      "/:id",
      tb_suachuats.getDetailTb_Suachuats
    );
    // router.put(
    //   "/update/:id",
    //   [isAuthenticated, isRole],
    //   tb_phieunx.updateTb_PhieuNX
    // );
    // router.post(
    //   "/close/:id",
    //   [isAuthenticated, isRole],
    //   tb_phieunx.closeTb_PhieuNX
    // );
    router.put(
      "/delete/:id",
      [isAuthenticated, isRole],
      tb_suachuats.deleteTb_Suachuats
    );
  
    app.use("/api/tb_suachuats", router);
  };
  