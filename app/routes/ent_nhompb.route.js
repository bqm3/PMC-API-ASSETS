module.exports = (app) => {
  const ent_nhompb = require("../controllers/ent_nhompb.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_nhompb.createEnt_nhompb);
  router.get("/all", ent_nhompb.getAlleEnt_nhompb);
  router.put("/update/:id", ent_nhompb.updateleEnt_nhompb);
  router.put("/delete/:id", ent_nhompb.deleteEnt_nhompb);

  app.use("/api/ent_nhompb", router);
};
