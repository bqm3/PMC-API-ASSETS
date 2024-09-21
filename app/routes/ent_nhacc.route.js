module.exports = (app) => {
    const ent_nhacc = require("../controllers/ent_nhacc.controller");
    // const {isAuthenticated}= require('../middleware/auth_middleware.js');
  
    var router = require("express").Router();
  
    
    router.post("/create", ent_nhacc.createEnt_Nhacc);
    router.get("/all", ent_nhacc.getAllEnt_Nhacc);
    router.get("/detail/:id", ent_nhacc.getDetailEnt_Nhacc);
    router.put("/update/:id", ent_nhacc.updateEnt_Nhacc);
    
    // router.put("/delete/:id", ent_nhacc.deleteEnt_nhacc);
  
    app.use("/api/v1/ent_nhacc", router);
  };
  