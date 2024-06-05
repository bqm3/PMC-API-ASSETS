module.exports = (app) => {
  const ent_nhomts = require("../controllers/ent_nhomts.controller.js");
  // const {isAuthenticated}= require('../middleware/auth_middleware.js');

  var router = require("express").Router();

  
  router.post("/create", ent_nhomts.createEnt_nhomts);
  router.get("/all", ent_nhomts.getAlleEnt_nhomts);
  router.put("/update/:id", ent_nhomts.updateleEnt_nhomts);
  router.put("/delete/:id", ent_nhomts.deleteEnt_nhomts);

  app.use("/api/ent_nhomts", router);
};
