module.exports = (app) => {
  const tb_phieuncc = require("../controllers/tb_phieuncc.controller.js");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");
  const { isRole } = require("../middleware/isRole.middleware.js");

  var router = require("express").Router();

  router.post(
    "/create",
    [isAuthenticated, isRole],
    tb_phieuncc.createTb_PhieuNCC
  );

  router.get("/all", tb_phieuncc.getAllTb_PhieuNCC);
  router.get("/:id", tb_phieuncc.getDetailTb_PhieuNCC);
  router.get("/kiemke/:id", [isAuthenticated], tb_phieuncc.getPhieuNCCByUser);
  router.post("/filter/:id", [isAuthenticated], tb_phieuncc.getPhieuNCCFilter);
  router.post("/taisan",[isAuthenticated], tb_phieuncc.getTaiSanByPhongBanDA);
  router.post("/by-nghiepvu", tb_phieuncc.getAllTb_PhieuNCC_By_NghiepVu);

  router.put(
    "/update/:id",
    [isAuthenticated, isRole],
    tb_phieuncc.updateTb_PhieuNCC
  );
  router.post(
    "/close/:id",
    [isAuthenticated, isRole],
    tb_phieuncc.closeTb_PhieuNCC
  );

  router.put(
    "/close-fast/:id",
    [isAuthenticated, isRole],
    tb_phieuncc.closeFastTb_PhieuNCC
  );

  router.put(
    "/delete/:id",
    [isAuthenticated, isRole],
    tb_phieuncc.deleteTb_PhieuNCC
  );

    router.put(
    "/update-xuat/:id/",
    [isAuthenticated, isRole],
    tb_phieuncc.updatePhieuNCC
  );

  app.use("/api/v1/tb_phieuncc", router);
};
