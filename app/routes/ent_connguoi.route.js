

module.exports = (app) => {
  const ent_connguoi = require("../controllers/ent_connguoi.controller.js");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");
  const { isRole } = require("../middleware/isRole.middleware.js");

  var router = require("express").Router();

  router.post("/create", [isAuthenticated, isRole], ent_connguoi.createEnt_connguoi);
  router.get("/all", [isAuthenticated, isRole], ent_connguoi.getAllEnt_connguoi);
  router.get("/:id", [isAuthenticated, isRole], ent_connguoi.getDetailEnt_connguoi);
  router.put("/update/:id", [isAuthenticated, isRole], ent_connguoi.updateEnt_connguoi);
  router.put("/delete/:id", [isAuthenticated, isRole], ent_connguoi.deleteEnt_connguoi);
  router.put("/status/:id/:status", [isAuthenticated, isRole], ent_connguoi.updateStatus);

  app.use("/api/v1/ent_connguoi", router);
};
