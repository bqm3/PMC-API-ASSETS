module.exports = (app) => {
  const ent_nhansupbda = require("../controllers/ent_nhansupbda.controller");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");

  var router = require("express").Router();

  router.post(
    "/create",
    [isAuthenticated],
    ent_nhansupbda.createEnt_NhansuPBDA
  );
  router.put(
    "/transfer/:id",
    [isAuthenticated],
    ent_nhansupbda.transferEnt_NhansuPBDA
  );

  router.put(
    "/close/:id", 
    [isAuthenticated],
    ent_nhansupbda.closeEnt_NhansuPBDA
  )

  router.get(
    "/", 
    [isAuthenticated],
    ent_nhansupbda.getAllEnt_NhansuPBDA
  )
  // router.get("/all", ent_nhansupbda.getAllEnt_Nhansupbda);
  // router.get("/detail/:id", ent_nhansupbda.getDetailEnt_Nhansupbda);
  // router.put("/update/:id", ent_nhansupbda.updateEnt_Nhansupbda);

  // router.put("/delete/:id", ent_nhansupbda.deleteEnt_nhansupbda);

  app.use("/api/v1/ent_nhansupbda", router);
};
