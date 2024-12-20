import { faker } from "@faker-js/faker";
import { HrReferent } from "@modules/welcome/entities/hr-referent.entity";
import { plainToInstance } from "class-transformer";

type T = HrReferent;

function createFakeHrReferent(hrReferent: Partial<T> = {}): T {
  return plainToInstance<T, T>(HrReferent, {
    email: hrReferent.email ?? faker.internet.email(),
    firstName: hrReferent.firstName ?? faker.person.firstName(),
    lastName: hrReferent.lastName ?? faker.person.lastName(),
  });
}

export { createFakeHrReferent };