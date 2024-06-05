module.exports = (app) => {
  const ent_phongbanda = require("../controllers/ent_phongbanda.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_phongbanda.createEnt_phongbanda);
  router.get("/all", ent_phongbanda.getAlleEnt_phongbanda);
  router.get("/:id", ent_phongbanda.getDetaileEnt_phongbanda);
  router.put("/update/:id", ent_phongbanda.updateleEnt_phongbanda);
  router.put("/delete/:id", ent_phongbanda.deleteEnt_phongbanda);

  app.use("/api/ent_phongbanda", router);
};
