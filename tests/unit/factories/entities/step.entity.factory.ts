import { faker } from "@faker-js/faker";
import { Step } from "@modules/step/entities/step.entity";
import { plainToInstance } from "class-transformer";

function createFakeStep(step: Partial<Step> = {}): Step {
  return plainToInstance(Step, {
    _id: step._id ?? faker.database.mongodbObjectId(),
    cutAt: step.cutAt ?? faker.number.float({ min: 0, max: 1 }),
    maxDays: step.maxDays ?? faker.number.float({ min: 0, max: 100 }),
    minDays: step.minDays ?? faker.number.float({ min: 0, max: 100 }),
    completionEmail: step.completionEmail,
    completionEmailManager: step.completionEmailManager,
    subSteps: step.subSteps ?? faker.number.int({ min: 1, max: 10 }),
  });
}

export { createFakeStep };