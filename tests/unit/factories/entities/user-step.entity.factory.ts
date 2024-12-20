import { faker } from "@faker-js/faker";
import type { Timestamp } from "@google-cloud/firestore";
import { UserStep } from "@modules/welcome/entities/user-step.entity";
import { plainToInstance } from "class-transformer";

type T = UserStep;

function createFakeUserStep(userStep: Partial<T> = {}): T {
  return plainToInstance<T, T>(UserStep, {
    _id: userStep._id ?? faker.database.mongodbObjectId(),
    unlockDate: userStep.unlockDate ?? faker.date.past() as unknown as Timestamp,
    unlockEmailSentAt: userStep.unlockEmailSentAt ?? faker.date.past() as unknown as Timestamp,
    completedAt: userStep.completedAt ?? faker.date.past() as unknown as Timestamp,
    subStepsCompleted: userStep.subStepsCompleted ?? faker.number.int({ min: 1, max: 4 }),
  });
}

export { createFakeUserStep };