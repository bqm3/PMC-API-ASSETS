module.exports = (app) => {
  const ent_hang = require("../controllers/ent_hang.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_hang.createEnt_hang);
  router.get("/all", ent_hang.getAllEnt_hang);
  router.put("/update/:id", ent_hang.updateEnt_hang);
  router.put("/delete/:id", ent_hang.deleteEnt_hang);

  app.use("/api/v1/ent_hang", router);
};
