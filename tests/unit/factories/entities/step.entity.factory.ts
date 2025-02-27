import { faker } from "@faker-js/faker";
import { Step } from "@modules/step/entities/step.entity";
import { plainToInstance } from "class-transformer";

type T = Step;

function createFakeStep(step: Partial<T> = {}): T {
  return plainToInstance<T, T>(Step, {
    _id: step._id ?? faker.database.mongodbObjectId(),
    cutAt: step.cutAt ?? faker.number.float({ min: 0, max: 1 }),
    maxDays: step.maxDays ?? faker.number.int({ min: 0, max: 100 }),
    minDays: step.minDays ?? faker.number.int({ min: 0, max: 100 }),
    completionEmail: step.completionEmail,
    completionEmailManager: step.completionEmailManager,
    subSteps: step.subSteps ?? faker.number.int({ min: 1, max: 10 }),
    unlockEmail: step.unlockEmail ?? { subject: "Default Subject", body: "Default Body" },
  });
}

export { createFakeStep };