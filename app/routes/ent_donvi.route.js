module.exports = (app) => {
  const ent_donvi = require("../controllers/ent_donvi.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_donvi.createEnt_donvi);
  router.get("/all", ent_donvi.getAllEnt_donvi);
  router.put("/update/:id", ent_donvi.updateEnt_donvi);
  router.put("/delete/:id", ent_donvi.deleteEnt_donvi);

  app.use("/api/v1/ent_donvi", router);
};
