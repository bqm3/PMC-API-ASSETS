module.exports = (app) => {
  const ent_thang = require("../controllers/ent_thang.controller");

  var router = require("express").Router();

  router.get("/all", ent_thang.getAllEnt_thang);

  app.use("/api/ent_thang", router);
};
