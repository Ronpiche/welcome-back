export class EmailServiceMock {
  run = jest.fn().mockResolvedValue([{ status: 'fulfilled', value: { _id: 1 } }]);
}
