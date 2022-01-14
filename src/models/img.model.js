const connection = require("../db-connection");

const findMany = (id) => {
  const sql = " Select * FROM image WHERE id=?";
  return connection.promise().query(sql, [id]);
};

const findAll = () => {
  const sql =
    "SELECT p.id AS project_id, p.link, p.description AS project_description, i.id AS image_id, i.image_name, i.image_src, i.image_description FROM image AS i JOIN project AS p ON i.project_id=p.id ORDER BY project_id ASC";
  return connection.promise().query(sql);
};

const createMany = (images) => {
  let sql = "";
  for (let i = 0; i < images.length; i++) {
    sql += "INSERT INTO image SET ?;";
  }
  console.log(sql);
  return connection.promise().query(sql, images);
};

const updateOne = (image, id) => {
  const sql = "UPDATE image SET ? WHERE id=?";
  return connection.promise().query(sql, [image, id]);
};

const deleteOne = (id) => {
  const sql = "DELETE FROM image WHERE id=?";
  return connection.promise().query(sql, [id]);
};

module.exports = { findMany, createMany, updateOne, deleteOne, findAll };
