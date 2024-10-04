const multer = require("multer");
const upload = multer();

module.exports = (app) => {
  const ent_user = require("../controllers/ent_user.controller.js");
  const { isAuthenticated } = require("../middleware/auth.middleware.js");

  var router = require("express").Router();

  router.post("/login", ent_user.login);
  router.post("/register", ent_user.register);
  router.post("/check-auth", [isAuthenticated], ent_user.checkAuth);
  router.get("/all", [isAuthenticated], ent_user.getAll);
  router.get("/:id", [isAuthenticated], ent_user.getDetail);
  router.put("/update/:id", [isAuthenticated], ent_user.updateUser);
  router.post("/create", [isAuthenticated], ent_user.createUser);
  router.post("/change-password", [isAuthenticated], ent_user.changePassword);
  router.post(
    "/update-profile",
    [isAuthenticated, upload.single("Anh")],
    ent_user.updateProfile
  );

  app.use("/api/v1/ent_user", router);
};
