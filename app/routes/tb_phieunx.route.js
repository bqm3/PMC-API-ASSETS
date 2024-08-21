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
  router.get("/:id", tb_phieunx.getDetailTb_PhieuNX);

  router.get("/kiemke/:id", [isAuthenticated], tb_phieunx.getPhieuNXByUser);

  router.put(
    "/update/:id",
    [isAuthenticated, isRole],
    tb_phieunx.updateTb_PhieuNX
  );
  router.post(
    "/close/:id",
    [isAuthenticated, isRole],
    tb_phieunx.closeTb_PhieuNX
  );

  router.put(
    "/close-fast/:id",
    [isAuthenticated, isRole],
    tb_phieunx.closeFastTb_PhieuNX
  );

  router.put(
    "/delete/:id",
    [isAuthenticated, isRole],
    tb_phieunx.deleteTb_PhieuNX
  );

  app.use("/api/tb_phieunx", router);
};
