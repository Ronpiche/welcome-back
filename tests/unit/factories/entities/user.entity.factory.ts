import { faker } from "@faker-js/faker";
import { WelcomeUser } from "@modules/welcome/entities/user.entity";
import { Practice } from "@modules/welcome/types/user.enum";
import { createFakeHrReferent } from "@tests/unit/factories/entities/hr-referent.entity.factory";
import { FAKE_USER_AGENCIES } from "@tests/unit/factories/factory.constants";
import { plainToInstance } from "class-transformer";

function createFakeWelcomeUser(user: Partial<WelcomeUser> = {}): WelcomeUser {
  return plainToInstance(WelcomeUser, {
    _id: user._id ?? faker.database.mongodbObjectId(),
    email: user.email ?? faker.internet.email(),
    note: user.note ?? faker.lorem.sentence(),
    signupDate: user.signupDate ?? faker.date.past().toISOString(),
    lastName: user.lastName ?? faker.person.lastName(),
    agency: user.agency ?? faker.helpers.arrayElement(FAKE_USER_AGENCIES),
    creationDate: user.creationDate ?? faker.date.past().toISOString(),
    hrReferent: user.hrReferent ?? createFakeHrReferent(),
    arrivalDate: user.arrivalDate ?? faker.date.past().toISOString(),
    firstName: user.firstName ?? faker.person.firstName(),
    lastUpdate: user.lastUpdate ?? faker.date.past().toISOString(),
    practices: user.practices ?? [faker.helpers.arrayElements(Object.values(Practice))],
    steps: user.steps ?? [],
  });
}

export { createFakeWelcomeUser };