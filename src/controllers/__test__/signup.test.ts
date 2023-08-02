import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful signup", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@example.com",
      password: "password",
    })
    .expect(201);
});

it("returns 400 with invalid email", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "notemail",
      password: "password",
    })
    .expect(400);
});

it("returns 400 with invalid password", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@example.com",
      password: "1",
    })
    .expect(400);
});

it("returns 400 with missing email and password", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({ email: "test@example.com" })
    .expect(400);

  await request(app)
    .post("/api/v1/users/signup")
    .send({ password: "password" })
    .expect(400);
});

it("returns 400 with duplicate email", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/v1/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(400);
});

it("sets a cookie after signup", async () => {
  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({ email: "test@example.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
