module.exports = (app) => {
  const ent_taisan = require("../controllers/ent_taisan.controller.js");
  const {isAuthenticated}= require('../middleware/auth.middleware.js');
  const {isRole}= require('../middleware/isRole.middleware.js');

  var router = require("express").Router();

  
  router.post("/create",[isAuthenticated, isRole], ent_taisan.createEnt_taisan);
  router.get("/all", ent_taisan.getAllEnt_taisan);
  router.get("/:id",[isAuthenticated, isRole], ent_taisan.getDetaileEnt_taisan);
  router.put("/update/:id",[isAuthenticated, isRole], ent_taisan.updateEnt_taisan);
  router.put("/delete/:id",[isAuthenticated, isRole], ent_taisan.deleteEnt_taisan);

  app.use("/api/v1/ent_taisan", router);
};
