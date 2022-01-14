const Joi = require("joi");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { SENDER_EMAIL_ADDRESS, SENDER_EMAIL_PASSWORD } = process.env;

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  deleteOne,
  verifyEmail,
} = require("../models/adm.model");
const { hashPassword, verifyPassword } = require("./security.controllers");

// Gestion d'envoie de mail
// Configuration of the mailbox that will send the mails
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL_ADDRESS,
    pass: SENDER_EMAIL_PASSWORD,
  },
});

// Middleware d'envoi de mail via nodemailer
const ContactEmail = (req, res) => {
  const { firstname, lastname, email, message } = req.body;

  const mailOptionsHtml = {
    from: SENDER_EMAIL_ADDRESS,
    to: "pierre-check4-wcs@gmail.com",
    cc: email,
    subject: `Envoyé depuis Portfolio:  ${firstname} ${lastname}`,
    html: `<h2>${firstname} vous a envoyé ce message : </h2><br/><p> ${message}</p>`,
  };
  transport.sendMail(mailOptionsHtml, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.status(200).send("Email sent with success !");
    }
  });
};

// Error handler
async function awesomeDataHandler(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    console.error("error", error);
    return [null, error];
  }
}

// Middleware de mon Crud
const getAdmins = async (req, res) => {
  const id = req.adminId ? req.adminId : req.params.id;
  const statusCode = req.adminId ? 201 : 200;
  console.log(id, statusCode);
  if (id) {
    const [data, error] = await awesomeDataHandler(findOne(id));
    if (data) {
      return data[0].length
        ? res.status(statusCode).json(data[0][0])
        : res
            .status(404)
            .send(
              "You're not authorize, check your credentials. Or the admin you're trying to get doesn't exist"
            );
    }
    return res.status(500).send(error);
  }
  const [data, error] = await awesomeDataHandler(findAll());
  return data ? res.json(data[0]) : res.status(500).send(error);
};

const createOneAdmin = async (req, res, next) => {
  console.log("create admin here");
  const { mail, clearPassword } = req.body;
  const [data, error] = await awesomeDataHandler(verifyEmail(mail));
  if (data[0][0]) {
    res.status(500).send("This client already exist");
  } else {
    let validationData = null;
    validationData = Joi.object({
      mail: Joi.string()
        .email({ minDomainSegments: 2, tlds: { alow: ["com", "fr", "net"] } })
        .required(),
      clearPassword: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.;!@#$%^&*])(?=.{8,})"
          )
        )
        .min(8)
        .max(32)
        .required(),
    }).validate({ mail, clearPassword }, { abortEarly: false }).error;
    if (validationData) {
      res.status(500).send(`${[validationData]} Data Invalid`);
    } else {
      const password = await hashPassword(clearPassword);
      const admin = {
        mail,
        password,
      };
      const [data, error] = await awesomeDataHandler(createOne(admin));
      if (data) {
        console.log(data[0].inserId);
        req.adminId = data[0].insertId;
        return next();
      }
      return res.status(500).send(error);
    }
  }
};

const updateOneAdmin = async (req, res, next) => {
  const { mail, clearPassword } = req.body;
  let validationData = null;
  validationData = Joi.object({
    mail: Joi.string()
      .email({ minDomainSegments: 2, tlds: { alow: ["com", "fr", "net"] } })
      .required(),
    clearPassword: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.;!@#$%^&*])(?=.{8,})"
        )
      )
      .min(8)
      .max(32)
      .required(),
  }).validate({ mail, clearPassword }, { abortEarly: false }).error;
  if (validationData) {
    console.log(validationData);
    res.status(500).send("Invalid data");
  } else {
    const password = await hashPassword(clearPassword);
    const admin = {
      mail,
      password,
    };
    const [data1, error1] = await awesomeDataHandler(
      updateOne(admin, req.params.id)
    );
    if (!error1) {
      req.adminId = [data1].insertId;
      next(req.adminId);
    }
  }
};

const verifyCredentials = async (req, res, next) => {
  const { mail, clearPassword } = req.body;
  try {
    const [admins] = await verifyEmail(mail);
    if (!admins) {
      return res.status(404).send("You're not authorize !");
    }
    const [admin] = admins;
    const passwordIsValid = await verifyPassword(admin.password, clearPassword);
    if (passwordIsValid) {
      req.admin = admin;
      return next();
    }
    return res.status(401).send("Your email or your password is wrong");
  } catch (err) {
    return res.status(500).send(`ERROR ${err}`);
  }
};

const deleteOneAdmin = (req, res) => {
  deleteOne(req.params.id)
    .then(([results]) => {
      if (results.affetedRows === 0) {
        return res.status(404).send("Admin not found");
      }
      return res.sendStatus(204);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = {
  getAdmins,
  createOneAdmin,
  updateOneAdmin,
  verifyCredentials,
  deleteOneAdmin,
  ContactEmail,
  awesomeDataHandler,
};
