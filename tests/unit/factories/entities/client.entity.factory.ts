import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { Client } from "@modules/client/entities/client.entity";

type T = Client;

function createFakeClient(client: Partial<T> = {}): T {
  return plainToInstance<T, T>(Client, {
    _id: client._id ?? faker.database.mongodbObjectId(),
    name: client.name ?? faker.word.noun(),
    logoStaticPath: client.logoStaticPath ?? faker.image.url(),
    sector: client.sector ?? faker.commerce.department(),
    country: client.country ?? faker.location.country(),
    numberOfEmployees: client.numberOfEmployees ?? faker.number.int(),
  });
}

export { createFakeClient };