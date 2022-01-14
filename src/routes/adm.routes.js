const adminRouter = require("express").Router();

const {
  createToken,
  authTokenFromCookie,
  refreshToken,
} = require("../controllers/security.controllers.js");
const {
  getAdmins,
  createOneAdmin,
  updateOneAdmin,
  verifyCredentials,
  deleteOneAdmin,
  ContactEmail,
} = require("../controllers/adm.controllers.js");

adminRouter.get("/:id", getAdmins);
adminRouter.get("/", getAdmins);
adminRouter.post("/contact", ContactEmail);
adminRouter.post("/login", verifyCredentials, createToken);
adminRouter.post("/refresh", authTokenFromCookie, refreshToken);
adminRouter.post("/", authTokenFromCookie, createOneAdmin, getAdmins);
adminRouter.put("/:id", authTokenFromCookie, updateOneAdmin, getAdmins);
adminRouter.delete("/:id", authTokenFromCookie, deleteOneAdmin);

module.exports = adminRouter;
