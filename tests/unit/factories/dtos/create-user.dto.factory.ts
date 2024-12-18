import { faker } from "@faker-js/faker";
import { CreateUserDto } from "@modules/welcome/dto/input/create-user.dto";
import { Practice } from "@modules/welcome/types/user.enum";
import { createFakeHrReferent } from "@tests/unit/factories/entities/hr-referent.entity.factory";
import { FAKE_USER_AGENCIES } from "@tests/unit/factories/factory.constants";
import { plainToInstance } from "class-transformer";

function createFakeCreateUserDto(createUserDto: Partial<CreateUserDto> = {}): CreateUserDto {
  return plainToInstance(CreateUserDto, {
    email: createUserDto.email ?? faker.internet.email(),
    firstName: createUserDto.firstName ?? faker.person.firstName(),
    lastName: createUserDto.lastName ?? faker.person.lastName(),
    signupDate: createUserDto.signupDate ?? faker.date.past().toISOString(),
    arrivalDate: createUserDto.arrivalDate ?? faker.date.past().toISOString(),
    practices: createUserDto.practices ?? [faker.helpers.arrayElements(Object.values(Practice))],
    hrReferent: createUserDto.hrReferent ?? createFakeHrReferent(),
    agency: createUserDto.agency ?? faker.helpers.arrayElement(FAKE_USER_AGENCIES),
    note: createUserDto.note ?? faker.lorem.sentence(),
  });
}

export { createFakeCreateUserDto };