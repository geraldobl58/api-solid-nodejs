import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should hash user password upon registration", async () => {
    const { gym } = await sut.execute({
      title: "Gym Title",
      description: null,
      phone: null,
      latitude: -23.5895703,
      longitude: -46.5066453,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
