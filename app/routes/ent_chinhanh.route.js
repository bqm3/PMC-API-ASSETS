module.exports = (app) => {
  const ent_chinhanh = require("../controllers/ent_chinhanh.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_chinhanh.createEnt_chinhanh);
  router.get("/all", ent_chinhanh.getAllEnt_chinhanh);
  router.put("/update/:id", ent_chinhanh.updateEnt_chinhanh);
  router.put("/delete/:id", ent_chinhanh.deleteEnt_chinhanh);

  app.use("/api/v1/ent_chinhanh", router);
};
