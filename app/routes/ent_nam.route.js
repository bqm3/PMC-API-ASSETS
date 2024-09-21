module.exports = (app) => {
  const ent_nam = require("../controllers/ent_nam.controller");

  var router = require("express").Router();

  router.get("/all", ent_nam.getAllEnt_nam);

  app.use("/api/v1/ent_nam", router);
};
