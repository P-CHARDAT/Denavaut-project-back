const request = require("supertest");
const connection = require("../src/db-connection");
const server = require("../src/server");

const admin = {
  mail: "AdminTest@gmail.com",
  clearPassword: "AdminTest1%$",
};

beforeAll(async () => {
  let sql = "DELETE FROM administrator WHERE id>0";
  await connection.promise().query(sql);
  sql = "ALTER TABLE administrator AUTO_INCREMENT=1";
  await connection.promise().query(sql);
});

describe("administrator routes is beeing tested", () => {
  it("GETs /api/admin should return status 200 and an empty array", async () => {
    const response = await request(server).get("/api/admin");
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(0);
  });
  it("POSTs /api/admin/ should return status 200 and an empty array", async () => {
    const response = await request(server).post("/api/admin").send(admin);
    expect(response.statusCode).toEqual(201);
    expect(response.body.id).toEqual(1);
  });
});
