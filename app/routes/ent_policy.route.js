module.exports = (app) => {
  const ent_policy = require("../controllers/ent_policy.controller.js");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");
  const { isRole } = require("../middleware/isRole.middleware.js");

  var router = require("express").Router();

  router.post(
    "/create",
    [isAuthenticated, isRole],
    ent_policy.createEnt_Policy
  );
  router.get("/all", ent_policy.getAllEnt_Policy);
  router.put(
    "/update/:id",
    [isAuthenticated, isRole],
    ent_policy.updateEnt_Policy
  );
  router.put(
    "/delete/:id",
    [isAuthenticated, isRole],
    ent_policy.deleteEnt_Policy
  );

  app.use("/api/v1/ent_policy", router);
};
