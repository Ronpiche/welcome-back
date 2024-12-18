import { faker } from "@faker-js/faker";
import { StepEmail } from "@modules/step/entities/step-email.entity";
import { plainToInstance } from "class-transformer";

function createFakeStepEmail(stepEmail: Partial<StepEmail> = {}): StepEmail {
  return plainToInstance(StepEmail, {
    subject: stepEmail.subject ?? faker.lorem.sentence(),
    body: stepEmail.body ?? faker.lorem.paragraph(),
  });
}

export { createFakeStepEmail };