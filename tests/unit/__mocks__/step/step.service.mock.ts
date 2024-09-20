import { stepEntityMock } from './Step.entity.mock';

export class StepServiceMock {
  create = jest.fn().mockResolvedValue({ status: 'OK', _id: stepEntityMock._id });
  findAll = jest.fn().mockResolvedValue([stepEntityMock]);
  findOne = jest.fn().mockResolvedValue(stepEntityMock);
  update = jest.fn().mockResolvedValue(stepEntityMock);
  remove = jest.fn().mockResolvedValue(undefined);
  generateSteps = jest.fn().mockResolvedValue([{ step: { _id: '1' }, dt: new Date('2024-06-01') }]);
}
