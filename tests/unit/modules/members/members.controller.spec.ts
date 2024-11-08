import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { MembersController } from "@src/modules/members/members.controller";
import { MembersService } from "@src/modules/members/members.service";
import type { OutputMembersDto } from "@src/modules/members/dto/output-members.dto";
import { createMemberMock, OutputMembersDtoMock } from "@tests/unit/__mocks__/members/members.entity.mock";

describe("MembersController", () => {
  let controller: MembersController;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([OutputMembersDtoMock]),
            createMany: jest.fn().mockResolvedValue(undefined),
            create: jest.fn().mockResolvedValue(OutputMembersDtoMock),
            remove: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(OutputMembersDtoMock),
          },
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
  });

  describe("create", () => {
    it("should create a member, and return an OutputMembers", async() => {
      const data = await controller.create(createMemberMock);
      expect(data).toBeDefined();
      expect(data).toEqual(OutputMembersDtoMock);
    });
  });

  describe("createMany", () => {
    it("should create many members", async() => {
      const res = await controller.createMany([createMemberMock]);
      expect(res).toBeUndefined();
    });
  });

  describe("findAll", () => {
    it("should return an array of OutputMembers", async() => {
      const outputUsers: OutputMembersDto[] = await controller.findAll();
      expect(outputUsers).toBeDefined();
      expect(outputUsers).toEqual([OutputMembersDtoMock]);
    });
  });

  describe("remove", () => {
    it("should delete 1 member", async() => {
      const documentId = "789QSD123";
      const res = await controller.remove(documentId);
      expect(res).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update 1 member", async() => {
      const documentId = "789QSD123";
      const res = await controller.update(documentId, createMemberMock);
      expect(res).toBeDefined();
      expect(res).toEqual(OutputMembersDtoMock);
    });
  });
});