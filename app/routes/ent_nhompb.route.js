module.exports = (app) => {
  const ent_nhompb = require("../controllers/ent_nhompb.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_nhompb.createEnt_nhompb);
  router.get("/all", ent_nhompb.getAllEnt_nhompb);
  router.put("/update/:id", ent_nhompb.updateEnt_nhompb);
  router.put("/delete/:id", ent_nhompb.deleteEnt_nhompb);

  app.use("/api/v1/ent_nhompb", router);
};
