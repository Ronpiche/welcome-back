import { faker } from "@faker-js/faker";
import type { Timestamp } from "@google-cloud/firestore";
import { WelcomeUser } from "@modules/welcome/entities/user.entity";
import { Practice } from "@modules/welcome/types/user.enum";
import { createFakeHrReferent } from "@tests/unit/factories/entities/hr-referent.entity.factory";
import { createFakeUserStep } from "@tests/unit/factories/entities/user-step.entity.factory";
import { FAKE_USER_AGENCIES } from "@tests/unit/factories/factory.constants";
import { plainToInstance } from "class-transformer";

type T = WelcomeUser;

function createFakeWelcomeUser(user: Partial<T> = {}): T {
  return plainToInstance<T, T>(WelcomeUser, {
    _id: user._id ?? faker.database.mongodbObjectId(),
    email: user.email ?? faker.internet.email(),
    note: user.note ?? faker.lorem.sentence(),
    signupDate: user.signupDate ?? faker.date.past().toISOString(),
    lastName: user.lastName ?? faker.person.lastName(),
    agency: user.agency ?? faker.helpers.arrayElement(FAKE_USER_AGENCIES),
    creationDate: user.creationDate ?? faker.date.past() as unknown as Timestamp,
    hrReferent: user.hrReferent ?? createFakeHrReferent(),
    arrivalDate: user.arrivalDate ?? faker.date.past().toISOString(),
    firstName: user.firstName ?? faker.person.firstName(),
    lastUpdate: user.lastUpdate ?? faker.date.recent() as unknown as Timestamp,
    practices: user.practices ?? faker.helpers.arrayElements(Object.values(Practice)),
    steps: user.steps ?? faker.helpers.multiple(() => createFakeUserStep()),
  });
}

export { createFakeWelcomeUser };