module.exports = (app) => {
  const ent_duan = require("../controllers/ent_duan.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_duan.createEnt_duan);
  router.get("/all", ent_duan.getAllEnt_duan);
  router.put("/update/:id", ent_duan.updateEnt_duan);
  router.put("/delete/:id", ent_duan.deleteEnt_duan);

  app.use("/api/v1/ent_duan", router);
};
