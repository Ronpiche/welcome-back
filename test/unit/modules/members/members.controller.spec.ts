import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from '@src/modules/members/members.controller';
import { MembersService } from '@src/modules/members/members.service';
import { MembersServiceMock } from '@test/unit/__mocks__/members/members.service.mock';
import { OutputMembersDto } from '@src/modules/members/dto/output-members.dto';
import { createMemberMock, OutputMembersDtoMock } from '@test/unit/__mocks__/members/members.entity.mock';

describe('MembersController', () => {
  let controller: MembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [{ provide: MembersService, useClass: MembersServiceMock }],
    }).compile();

    controller = module.get<MembersController>(MembersController);
  });

  describe('create', () => {
    it('should create a member, and return an OutputMembers', () => {
      const data = controller.create(createMemberMock);
      expect(data).toBeDefined();
      expect(data).toEqual(OutputMembersDtoMock);
    });
  });

  describe('createMany', () => {
    it('should create many members', async () => {
      const res = await controller.createMany([createMemberMock]);
      expect(res).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of OutputMembers', async () => {
      const outputUsers: OutputMembersDto[] = await controller.findAll();
      expect(outputUsers).toBeDefined();
      expect(outputUsers).toEqual([OutputMembersDtoMock]);
    });
  });

  describe('remove', () => {
    it('should delete 1 member', () => {
      const documentId = '789QSD123';
      const res = controller.remove(documentId);
      expect(res).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update 1 member', () => {
      const documentId = '789QSD123';
      const res = controller.update(documentId, createMemberMock);
      expect(res).toBeDefined();
      expect(res).toEqual(OutputMembersDtoMock);
    });
  });
});
