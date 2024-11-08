import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AgenciesController } from "@src/modules/agencies/agencies.controller";
import { AgenciesService } from "@src/modules/agencies/agencies.service";
import type { OutputAgencyDto } from "@src/modules/agencies/dto/output-agency.dto";
import { createAgencyMock, outputAgencyMock } from "@tests/unit/__mocks__/agencies/agencies.entity.mock";

describe("agencyController", () => {
  let controller: AgenciesController;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgenciesController],
      providers: [
        {
          provide: AgenciesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([outputAgencyMock]),
            createMany: jest.fn().mockResolvedValue(undefined),
            create: jest.fn().mockResolvedValue(outputAgencyMock),
            remove: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(outputAgencyMock),
          },
        },
      ],
    }).compile();

    controller = module.get<AgenciesController>(AgenciesController);
  });

  describe("create", () => {
    it("should create an agency, and return an OutputAgency", async() => {
      const data = await controller.create(createAgencyMock);
      expect(data).toBeDefined();
      expect(data).toEqual(outputAgencyMock);
    });
  });

  describe("createMany", () => {
    it("should create many agencies", async() => {
      const res = await controller.createMany([createAgencyMock]);
      expect(res).toBeUndefined();
    });
  });

  describe("findAll", () => {
    it("should return an array of Outputagencies", async() => {
      const outputUsers: OutputAgencyDto[] = await controller.findAll();
      expect(outputUsers).toBeDefined();
      expect(outputUsers).toEqual([outputAgencyMock]);
    });
  });

  describe("remove", () => {
    it("should delete 1 agency", async() => {
      const documentId = "789QSD123";
      const res = await controller.remove(documentId);
      expect(res).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update 1 agency", async() => {
      const documentId = "789QSD123";
      const res = await controller.update(documentId, createAgencyMock);
      expect(res).toBeDefined();
      expect(res).toEqual(outputAgencyMock);
    });
  });
});