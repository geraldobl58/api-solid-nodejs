import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticatUser(app: FastifyInstance) {
  await request(app.server).post("/users").send({
    name: "Test",
    email: "test1@example.com",
    password: "12345678",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "test1@example.com",
    password: "12345678",
  });

  const { token } = authResponse.body;

  return {
    token,
  };
}
