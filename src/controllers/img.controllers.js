const Joi = require("joi");
const multer = require("multer");

const {
  findAll,
  findMany,
  createMany,
  updateOne,
  deleteOne,
} = require("../models/img.model");

const { awesomeDataHandler } = require("./adm.controllers");

const addImages = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/assets");
    },
    filename: (_, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage: storage }).array("file");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    const configuration = JSON.parse(req.body.configuration);
    req.images = [];
    for (let i = 0; i < req.files.length; i++) {
      req.images.push({
        image_src: req.files[i].filename,
        image_name: configuration.name,
      });
    }
    return next();
  });
};

const createImages = async (req, res, next) => {
  console.log(req.projectId);
  req.images.forEach((element) => {
    element.project_id = req.projectId;
  });
  const [data, error] = await awesomeDataHandler(createMany(req.images));
  if (data) {
    req.imageId = data[0].insertId;
    return next();
  }
  return res.status(500).send(error);
};

const getImages = async (req, res) => {
  const id = req.imageId ? req.imageId : req.params.id;
  const [data, error] = await awesomeDataHandler(findMany(id));
  if (data) {
    return data[0].length
      ? res.status(200).send(data[0])
      : res.status(404).send("Image not found");
  }
  return res.status(500).send(error);
};

const getAllImages = async (req, res) => {
  let projects = [];
  const [data, error] = await awesomeDataHandler(findAll());
  if (data[0].length) {
    for (let i = 0; i < data[0].length; i++) {
      if (
        i === 0 ||
        projects[projects.length - 1].project_id !== data[0][i].project_id
      ) {
        projects.push({
          project_id: data[0][i].project_id,
          project_name: data[0][i].image_name,
          link: data[0][i].link,
          project_description: data[0][i].project_description,
          images: [
            {
              image_src: data[0][i].image_src,
              image_description: data[0][i].image_description,
              image_id: data[0][i].image_id,
            },
          ],
        });
      } else if (
        projects[projects.length - 1].project_id === data[0][i].project_id
      ) {
        projects[projects.length - 1].images.push({
          image_src: data[0][i].image_src,
          image_description: data[0][i].image_description,
          image_id: data[0][i].image_id,
        });
      }
    }
    return res.json(projects);
  }
  return res.status(404).send("Did not find any image for this project");
};

const updateOneImage = async (req, res, next) => {
  const { image_description } = req.body;
  let validationData = null;
  validationData = Joi.object({
    image_description: Joi.string().required(),
  }).validate({ image_description }, { abortEarly: false }).error;

  if (validationData) {
    res.status(500).send("Invalid data");
  } else {
    const image = {
      image_description,
    };
    const [data, error] = await awesomeDataHandler(
      updateOne(image, req.params.id)
    );
    if (data) {
      req.imageId = [data].insertId;
      return next();
    }
    return res.status(500).send(error);
  }
};

// Controlleur pour supprimer un projet :
const deleteOneImage = async (req, res) => {
  const [data, error] = await awesomeDataHandler(deleteOne(req.params.id));
  return data ? res.sendStatus(204) : res.status(500).send(error);
};

module.exports = {
  addImages,
  createImages,
  getImages,
  getAllImages,
  updateOneImage,
  deleteOneImage,
};
