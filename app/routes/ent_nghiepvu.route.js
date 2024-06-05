module.exports = (app) => {
  const ent_nghiepvu = require("../controllers/ent_nghiepvu.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_nghiepvu.createEnt_nghiepvu);
  router.get("/all", ent_nghiepvu.getAllEnt_nghiepvu);
  router.put("/update/:id", ent_nghiepvu.updateEnt_nghiepvu);
  router.put("/delete/:id", ent_nghiepvu.deleteEnt_nghiepvu);

  app.use("/api/ent_nghiepvu", router);
};
