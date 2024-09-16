import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { RegistertUseCase } from "@/use-cases/register";

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerSchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegistertUseCase(usersRepository);

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
