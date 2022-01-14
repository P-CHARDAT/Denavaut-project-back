const projetsRouter = require("express").Router();
const { addImages, createImages } = require("../controllers/img.controllers");
const {
  getProjects,
  createOneProject,
  updateOneProject,
  deleteOneProject,
} = require("../controllers/projects.controllers");
const {
  authTokenFromCookie,
} = require("../controllers/security.controllers.js");

projetsRouter.get("/:id", getProjects);
projetsRouter.get("/", getProjects);
projetsRouter.post("/", authTokenFromCookie, addImages, createOneProject, createImages, getProjects);
projetsRouter.put("/:id", authTokenFromCookie, updateOneProject, getProjects);
projetsRouter.delete("/:id", authTokenFromCookie, deleteOneProject);

module.exports = projetsRouter;