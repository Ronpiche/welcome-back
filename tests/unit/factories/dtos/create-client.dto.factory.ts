import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { CreateClientDto } from "@modules/client/dto/create-client.dto";

type T = CreateClientDto;

function createFakeCreateClientDto(createClientDto: Partial<T> = {}): T {
  return plainToInstance<T, T>(CreateClientDto, {
    _id: createClientDto._id ?? faker.database.mongodbObjectId(),
    name: createClientDto.name ?? faker.word.noun(),
    logoStaticPath: createClientDto.logoStaticPath ?? faker.image.url(),
    sector: createClientDto.sector ?? faker.commerce.department(),
    country: createClientDto.country ?? faker.location.country(),
    numberOfEmployees: createClientDto.numberOfEmployees ?? faker.number.int(),
  });
}

export { createFakeCreateClientDto };