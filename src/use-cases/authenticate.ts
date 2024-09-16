import { compare } from "bcryptjs";

import { User } from "@prisma/client";

import { UsersRepository } from "@/repositories/users-repository";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticatedUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUserCaseResponse {
  user: User;
}

export class AuthenticatedUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticatedUseCaseRequest): Promise<AuthenticateUserCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
