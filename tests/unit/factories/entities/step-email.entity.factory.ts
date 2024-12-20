import { faker } from "@faker-js/faker";
import { StepEmail } from "@modules/step/entities/step-email.entity";
import { plainToInstance } from "class-transformer";

type T = StepEmail;

function createFakeStepEmail(stepEmail: Partial<T> = {}): T {
  return plainToInstance<T, T>(StepEmail, {
    subject: stepEmail.subject ?? faker.lorem.sentence(),
    body: stepEmail.body ?? faker.lorem.paragraph(),
  });
}

export { createFakeStepEmail };