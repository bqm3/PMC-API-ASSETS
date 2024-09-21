module.exports = (app) => {
    const ent_chucvu = require("../controllers/ent_chucvu.controller.js");
    // const {isAuthenticated}= require('../middleware/auth_middleware.js');
  
    var router = require("express").Router();

    router.get("/all", ent_chucvu.getAllEnt_chucvu);
  
    app.use("/api/v1/ent_chucvu", router);
  };
  