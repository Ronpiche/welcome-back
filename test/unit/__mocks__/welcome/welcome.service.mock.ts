import { outputUpdateWelcomeMock, outputWelcomeMock } from './User.entity.mock';

export class WelcomeServiceMock {
  findAll = jest.fn().mockResolvedValue([outputWelcomeMock]);
  findOne = jest.fn().mockResolvedValue(outputWelcomeMock);
  remove = jest.fn().mockResolvedValue(undefined);
  update = jest.fn().mockResolvedValue(outputUpdateWelcomeMock);
  createUser = jest.fn().mockResolvedValue(outputWelcomeMock);
  transformDbOjectStringsToArray = jest.fn().mockResolvedValue({ status: 'success' });
  run = jest.fn().mockResolvedValue([{ status: 'fulfilled', value: { _id: '1' } }]);
  completeStep = jest.fn().mockResolvedValue({ status: 'ok' });
}
