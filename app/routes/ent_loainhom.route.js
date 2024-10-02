module.exports = (app) => {
  const ent_loainhom = require("../controllers/ent_loainhom.controller.js");
  const {isAuthenticated}= require('../middleware/auth.middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_loainhom.createEnt_Loainhom);
  router.get("/all", ent_loainhom.getAllEnt_Loainhom);
  router.put("/update/:id",[isAuthenticated], ent_loainhom.updateEnt_Loainhom);
  router.put("/delete/:id", ent_loainhom.deleteEnt_Loainhom);

  app.use("/api/v1/ent_loainhom", router);
};
