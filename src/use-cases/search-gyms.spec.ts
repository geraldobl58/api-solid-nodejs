import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to seacrh for gym", async () => {
    await gymsRepository.create({
      title: "Gym 1",
      description: null,
      phone: null,
      latitude: -23.5895703,
      longitude: -46.5066453,
    });

    await gymsRepository.create({
      title: "Gym 2",
      description: null,
      phone: null,
      latitude: -23.5895703,
      longitude: -46.5066453,
    });

    const { gyms } = await sut.execute({
      query: "Gym 1",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym 1" })]);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.5895703,
        longitude: -46.5066453,
      });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym 21" }),
      expect.objectContaining({ title: "Gym 22" }),
    ]);
  });
});
