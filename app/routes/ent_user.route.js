const multer = require("multer");
const upload = multer();

module.exports = (app) => {
  const ent_user = require("../controllers/ent_user.controller.js");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");
  

  var router = require("express").Router();

  router.post("/login", ent_user.login);
  router.post("/register", ent_user.register);
  router.post("/check-auth", [isAuthenticated], ent_user.checkAuth);
  router.post("/change-password", [isAuthenticated], ent_user.changePassword);
  router.post(
    "/update-profile",
    [isAuthenticated, upload.single("Anh")],
    ent_user.updateProfile
  );

  app.use("/api/ent_user", router);
};
