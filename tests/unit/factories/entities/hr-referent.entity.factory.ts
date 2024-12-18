import { faker } from "@faker-js/faker";
import { HrReferent } from "@modules/welcome/entities/hr-referent.entity";
import { plainToInstance } from "class-transformer";

function createFakeHrReferent(hrReferent: Partial<HrReferent> = {}): HrReferent {
  return plainToInstance(HrReferent, {
    email: hrReferent.email ?? faker.internet.email(),
    firstName: hrReferent.firstName ?? faker.person.firstName(),
    lastName: hrReferent.lastName ?? faker.person.lastName(),
  });
}

export { createFakeHrReferent };