import { OutputMembersDtoMock } from "./members.entity.mock";

export class MembersServiceMock {
  findAll = jest.fn().mockResolvedValue([OutputMembersDtoMock]);

  createMany = jest.fn().mockResolvedValue(undefined);

  create = jest.fn().mockReturnValue(OutputMembersDtoMock);

  remove = jest.fn().mockReturnValue(undefined);

  update = jest.fn().mockReturnValue(OutputMembersDtoMock);
}