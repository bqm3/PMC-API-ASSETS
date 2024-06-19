module.exports = (app) => {
    // const tb_phieunxct = require("../controllers/tb");
    const { isAuthenticated } = require("../middleware/auth.middleware.js");
    const { isRole } = require("../middleware/isRole.middleware.js");
  
    var router = require("express").Router();
  
    // router.post(
    //   "/create",
    //   [isAuthenticated, isRole],
    //   tb_phieunxct.createTb_PhieuNXCT
    // );
    // router.get("/all", tb_phieunxct.getAllTb_PhieuNXCT);
  
    app.use("/api/tb_phieunxct", router);
  };
  