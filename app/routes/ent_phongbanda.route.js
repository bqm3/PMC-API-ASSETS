module.exports = (app) => {
  const ent_phongbanda = require("../controllers/ent_phongbanda.controller.js");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");
  const { isRole } = require("../middleware/isRole.middleware.js");

  var router = require("express").Router();

  router.post(
    "/create",
    [isAuthenticated, isRole],
    ent_phongbanda.createEnt_phongbanda
  );
  router.get("/all", ent_phongbanda.getAllEnt_phongbanda);
  router.get("/:id", ent_phongbanda.getDetaileEnt_phongbanda);
  router.put(
    "/update/:id",
    [isAuthenticated, isRole],
    ent_phongbanda.updateEnt_phongbanda
  );
  router.put(
    "/delete/:id",
    [isAuthenticated, isRole],
    ent_phongbanda.deleteEnt_phongbanda
  );

  app.use("/api/v1/ent_phongbanda", router);
};
