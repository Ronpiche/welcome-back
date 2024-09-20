export class ContentServiceMock {
  create = jest.fn().mockResolvedValue({
    id: 'test-id',
    data: {},
  });

  findAll = jest.fn().mockResolvedValue([
    {
      id: 'test-id',
      data: {},
    },
  ]);

  findOne = jest.fn().mockResolvedValue({
    id: 'test-id',
    data: {},
  });

  update = jest.fn().mockResolvedValue({
    id: 'test-id',
    data: {},
  });
}
