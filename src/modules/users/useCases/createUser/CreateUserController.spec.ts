import request = require ('supertest')
import {app} from '../../../../app'
import { Connection, createConnection } from 'typeorm';
import { v4 as uuid } from "uuid";
import { hash } from 'bcryptjs';



let connection: Connection;

describe("Create user controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}')
      `
    );
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a user", async() => {
    const res = await request(app).post("/users/").send({
      name: "Guilherme C Gonzalez",
      email: "gcg@gcg.com",
      password: "gcg123"
    })

    expect(res.status).toBe(201)
  })

  it("should not be able to create a user", async() => {
    const res = await request(app).post("/users/").send({
      name: "Guilherme C Gonzalez",
      email: "gcg@gcg.com",
      password: "gcg123"
    })

    expect(res.status).toBe(400)
  })
})


