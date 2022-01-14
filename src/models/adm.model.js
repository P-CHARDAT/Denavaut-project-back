const connection = require("../db-connection");

const findAll = (decroissant) => {
  const sql = "SELECT * FROM administrator ";
  return connection.promise().query(sql);
};

const findOne = (id) => {
  const sql = "SELECT * FROM administrator WHERE id=?";
  return connection.promise().query(sql, [id]);
};

const createOne = (projet) => {
  const sql = "INSERT INTO administrator SET ?";
  return connection.promise().query(sql, [projet]);
};

const updateOne = (projet, id) => {
  const sql = "UPDATE administrator SET ? WHERE id=?";
  return connection.promise().query(sql, [projet, id]);
};

const deleteOne = (id) => {
  const sql = "DELETE FROM administrator WHERE id=?";
  return connection.promise().query(sql, [id]);
};

const verifyEmail = (mail) => {
  const sql = "SELECT * FROM administrator WHERE mail= ?";
  return connection.promise().query(sql, [mail]);
};

module.exports = {
  findAll,
  findOne,
  createOne,
  updateOne,
  deleteOne,
  verifyEmail,
};
