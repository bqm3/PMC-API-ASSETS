module.exports = (app) => {
  const ent_grouppolicy = require("../controllers/ent_grouppolicy.controller.js");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");
  const { isRole } = require("../middleware/isRole.middleware.js");

  var router = require("express").Router();

  router.post(
    "/create",
    [isAuthenticated, isRole],
    ent_grouppolicy.creatEnt_GroupPolicy
  );
  router.get("/all", ent_grouppolicy.getAllEnt_GroupPolicy);
  router.put(
    "/update/:id",
    [isAuthenticated, isRole],
    ent_grouppolicy.updateEnt_GroupPolicy
  );
  router.put(
    "/delete/:id",
    [isAuthenticated, isRole],
    ent_grouppolicy.deleteEnt_GroupPolicy
  );

  app.use("/api/v1/ent_grouppolicy", router);
};
