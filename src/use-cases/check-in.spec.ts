import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

import { CheckinUseCase } from "./check-in";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Gym 1",
      description: "",
      phone: "",
      latitude: -23.5895703,
      longitude: -46.5066453,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.5895703,
      userLongitude: -46.5066453,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.5895703,
      userLongitude: -46.5066453,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -23.5895703,
        userLongitude: -46.5066453,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should not be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.5895703,
      userLongitude: -46.5066453,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.5895703,
      userLongitude: -46.5066453,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Gym 1",
      description: "",
      phone: "",
      latitude: new Decimal(-23.5743177),
      longitude: new Decimal(-46.4736487),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -23.5895703,
        userLongitude: -49.5066453,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
