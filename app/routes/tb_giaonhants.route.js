module.exports = (app) => {
    const tb_giaonhants = require("../controllers/tb_giaonhants.controller.js");
    const { isAuthenticated } = require("../middleware/auth.middleware.js");
    const { isRole } = require("../middleware/isRole.middleware.js");
  
    var router = require("express").Router();
  
    //them
    router.post(
      "/create",
      [isAuthenticated, isRole],
      tb_giaonhants.createGiaoNhanTS
    );

    //sua
    router.put(
      "/update/:id",
      [isAuthenticated, isRole],
      tb_giaonhants.updateGiaoNhanTS
    );

    //get chi tiet id phieu
    router.get(
      "/get_detail/:id",
      [isAuthenticated, isRole],
      tb_giaonhants.getDetailGiaoNhanTS
    );

    //xóa 
    router.put(
      "/delete/:id",
      [isAuthenticated, isRole],
      tb_giaonhants.deleteGiaoNhanTS
    );

    //get all
    router.get(
      "/getall",
      [isAuthenticated, isRole],
      tb_giaonhants.getAllGiaoNhanTS
    );

    //get id phong ban
    router.get(
      "/get/:id",
      [isAuthenticated, isRole],
      tb_giaonhants.getByIDPBanGiaoNhanTS
    );
  
    app.use("/api/v1/tb_giaonhants", router);
  };
  