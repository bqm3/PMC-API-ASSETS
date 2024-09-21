

module.exports = (app) => {
  const ent_nhomts = require("../controllers/ent_nhomts.controller.js");
  const {isAuthenticated}= require('../middleware/auth.middleware.js');
  const { isRole } = require("../middleware/isRole.middleware.js");

  var router = require("express").Router();

  
  router.post("/create",[isAuthenticated, isRole], ent_nhomts.createEnt_nhomts);
  router.get("/all", ent_nhomts.getAllEnt_nhomts);
  router.put("/update/:id",[isAuthenticated, isRole], ent_nhomts.updateEnt_nhomts);
  router.put("/delete/:id",[isAuthenticated, isRole], ent_nhomts.deleteEnt_nhomts);

  app.use("/api/v1/ent_nhomts", router);
};
