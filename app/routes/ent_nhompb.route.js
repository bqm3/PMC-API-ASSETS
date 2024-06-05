module.exports = (app) => {
    const ent_nhompb = require("../controllers/ent_nhompb.controller.js");
    // const {isAuthenticated}= require('../middleware/auth_middleware.js');
  
    var router = require("express").Router();
  
    // Create a new Ent_calv
    router.post("/create", ent_nhompb.createEnt_nhompb);
  
    app.use("/api/ent_nhompb", router);
  };
  