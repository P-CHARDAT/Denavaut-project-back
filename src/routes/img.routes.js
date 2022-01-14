const imagesRouter = require("express").Router();

const {
  getImages,
  getAllImages,
  updateOneImage,
  deleteOneImage,
} = require("../controllers/img.controllers");
const { authTokenFromCookie } = require("../controllers/security.controllers");

imagesRouter.get("/:id", getImages);
imagesRouter.get("/", getAllImages);
imagesRouter.put("/:id", authTokenFromCookie, updateOneImage, getImages);
imagesRouter.delete("/:id", authTokenFromCookie, deleteOneImage);

module.exports = imagesRouter;
