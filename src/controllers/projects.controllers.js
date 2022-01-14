const Joi = require("joi");

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  deleteOne,
} = require("../models/projects.model");
const { awesomeDataHandler } = require("./adm.controllers");

// Controlleur pour nos requêtes de type Get
const getProjects = async (req, res) => {
  const id = req.projectId ? req.projectId : req.params.id;
  // Dans le cas où je souhaite un projet via son id :
  if (id) {
    const [data, error] = await awesomeDataHandler(findOne(id));
    // Si la requête se passe bien :
    if (data) {
      return data[0].length
        ? res.status(req.imageId ? 201 : 200).json(data[0][0])
        : res.status(404).send("Project not found");
    }
    // Je gère l'erreur :
    return res.status(500).send(error);
  }
  // Si je n'ai pas d'Id j'appelle tous mes projets :
  const [data, error] = await awesomeDataHandler(findAll());
  return data ? res.status(200).json(data[0]) : res.status(500).send(error);
};

// Controlleur pour nos requêtes de type Post
const createOneProject = async (req, res, next) => {
  const configuration = JSON.parse(req.body.configuration);
  const { name, description, link } = configuration;
  let validationData = null;
  validationData = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    link: Joi.string(),
  }).validate({ name, description, link }, { abortEarly: false }).error;
  if (validationData) {
    return res.status(500).send(`${[validationData]} Data Invalid`);
  }
  const project = {
    name,
    description,
    link,
  };
  const [data, error] = await awesomeDataHandler(createOne(project));
  if (data) {
    req.projectId = data[0].insertId;
    return next();
  }
  return res.status(500).send(error);
};

// Controlleur pour mettre à jour l'entité Project
const updateOneProject = async (req, res, next) => {
  const { name, description, link } = req.body;

  let validationData = null;
  validationData = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    link: Joi.string(),
  }).validate({ name, description, link }, { abortEarly: false }).error;
  if (validationData) {
    res.status(500).send("Invalid data");
  } else {
    const project = {
      name,
      description,
      link,
    };
    const [data, error] = await awesomeDataHandler(
      updateOne(project, req.params.id)
    );
    if (data) {
      req.projectId = [data].insertId;
      return next(req.projectId);
    }
    return res.status(500).send(error);
  }
};

// Controlleur pour supprimer un projet :
const deleteOneProject = async (req, res) => {
  const [data, error] = await awesomeDataHandler(deleteOne(req.params.id));
  return data ? res.sendStatus(204) : res.status(500).send(error);
};

module.exports = {
  getProjects,
  createOneProject,
  updateOneProject,
  deleteOneProject,
};
