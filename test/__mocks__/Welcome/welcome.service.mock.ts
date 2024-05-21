import { outputWelcomeMock } from './User.entity.mock';

export class WelcomeServiceMock {
  findAll = jest.fn().mockResolvedValue([outputWelcomeMock]);
  findOne = jest.fn().mockResolvedValue(outputWelcomeMock);
  remove = jest.fn().mockResolvedValue(undefined);
}
