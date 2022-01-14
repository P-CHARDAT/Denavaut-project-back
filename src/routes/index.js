const mainRouter = require("express").Router();
const adminRouter = require("./adm.routes");
const projectsRouter = require("./projects.routes");
const imagesRouter = require("./img.routes");


mainRouter.use("/admin", adminRouter);
mainRouter.use("/projects", projectsRouter);
mainRouter.use("/images", imagesRouter);


module.exports = mainRouter;