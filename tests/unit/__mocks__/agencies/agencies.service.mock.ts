import { outputAgencyMock } from "./agencies.entity.mock";

export class AgenciesServiceMock {
  findAll = jest.fn().mockResolvedValue([outputAgencyMock]);

  createMany = jest.fn().mockResolvedValue(undefined);

  create = jest.fn().mockReturnValue(outputAgencyMock);

  remove = jest.fn().mockReturnValue(undefined);

  update = jest.fn().mockReturnValue(outputAgencyMock);
}