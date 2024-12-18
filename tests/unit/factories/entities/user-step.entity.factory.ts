import { faker } from "@faker-js/faker";
import { UserStep } from "@modules/welcome/entities/user-step.entity";
import { plainToInstance } from "class-transformer";

function createFakeUserStep(userStep: Partial<UserStep> = {}): UserStep {
  return plainToInstance(UserStep, {
    _id: userStep._id ?? faker.database.mongodbObjectId(),
    unlockDate: userStep.unlockDate ?? faker.date.past().toISOString(),
    unlockEmailSentAt: userStep.unlockEmailSentAt ?? faker.date.past().toISOString(),
    completedAt: userStep.completedAt ?? faker.date.past().toISOString(),
    subStepsCompleted: userStep.subStepsCompleted ?? faker.number.int({ min: 1, max: 4 }),
  });
}

export { createFakeUserStep };