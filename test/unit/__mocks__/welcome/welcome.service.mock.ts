import { outputUpdateWelcomeMock, outputWelcomeMock } from './User.entity.mock';

export class WelcomeServiceMock {
  findAll = jest.fn().mockResolvedValue([outputWelcomeMock]);
  findOne = jest.fn().mockResolvedValue(outputWelcomeMock);
  remove = jest.fn().mockResolvedValue(undefined);
  update = jest.fn().mockResolvedValue(outputUpdateWelcomeMock);
  createUser = jest.fn().mockResolvedValue({ status: 'ok', id: '789QSD123' });
  transformDbOjectStringsToArray = jest.fn().mockResolvedValue({ status: 'success' });
}
