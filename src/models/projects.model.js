const connection = require("../db-connection");

const findAll = () => {
  const sql = "SELECT * FROM project";
  return connection.promise().query(sql);
};

const findOne = (id) => {
  const sql = "SELECT * FROM project WHERE id=?";
  return connection.promise().query(sql, [id]);
};

const createOne = (projets) => {
  const sql = "INSERT INTO project SET ?";
  return connection.promise().query(sql, [projets]);
};

const updateOne = (projets, id) => {
  const sql = "UPDATE project SET ? WHERE id=?";
  return connection.promise().query(sql, [projets, id]);
};

const deleteOne = (id) => {
  const sql = "DELETE FROM project WHERE id=?";
  return connection.promise().query(sql, [id]);
};


module.exports = { findAll, createOne, findOne, updateOne, deleteOne };
