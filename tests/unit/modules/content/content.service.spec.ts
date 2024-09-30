import { createContentDtoMock } from "@tests/unit/__mocks__/content/content.entities.mock";
import { FirestoreServiceMock } from "@tests/unit/__mocks__/firestore.service";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { ContentService } from "@src/modules/content/content.service";
import type { CreateContentDto } from "@src/modules/content/dto/create-content.dto";
import type { ContentEntity } from "@src/modules/content/entities/content.entity";
import { FirestoreService } from "@src/services/firestore/firestore.service";

describe("ContentService", () => {
  let service: ContentService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentService, { provide: FirestoreService, useClass: FirestoreServiceMock }],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it("should create a content", async() => {
    const res: ContentEntity = await service.create(createContentDtoMock);
    expect(res.id).toBeDefined();
    expect(res.data).toBeDefined();
    expect(res).not.toBeInstanceOf(BadRequestException);
    expect(res).not.toBeInstanceOf(InternalServerErrorException);
  });

  it("should create a content with a empty object", async() => {
    const createContentDto: CreateContentDto = {};
    let res: ContentEntity;
    try {
      res = await service.create(createContentDto);
      expect(res).not.toHaveProperty("id");
      expect(res).not.toHaveProperty("data");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("This content is empty");
    }
  });

  it("should create a content with a undefined object", async() => {
    const createContentDto: CreateContentDto = undefined;
    let res: ContentEntity;
    try {
      res = await service.create(createContentDto);
      expect(res).not.toHaveProperty("id");
      expect(res).not.toHaveProperty("data");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("This content is empty");
    }
  });

  it("should create a content with a null object", async() => {
    const createContentDto: CreateContentDto = null;
    let res: ContentEntity;
    try {
      res = await service.create(createContentDto);
      expect(res).not.toHaveProperty("id");
      expect(res).not.toHaveProperty("data");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("This content is empty");
    }
  });

  it("should create a content with a 0 value", async() => {
    const createContentDto: CreateContentDto = 0;
    let res: ContentEntity;
    try {
      res = await service.create(createContentDto);
      expect(res).not.toHaveProperty("id");
      expect(res).not.toHaveProperty("data");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("This content is empty");
    }
  });

  it("should create a content with a false value", async() => {
    const createContentDto: CreateContentDto = false;
    let res: ContentEntity;
    try {
      res = await service.create(createContentDto);
      expect(res).not.toHaveProperty("id");
      expect(res).not.toHaveProperty("data");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("This content is empty");
    }
  });

  it("should create a content with a NaN value", async() => {
    const createContentDto: CreateContentDto = NaN;
    let res: ContentEntity;
    try {
      res = await service.create(createContentDto);
      expect(res).not.toHaveProperty("id");
      expect(res).not.toHaveProperty("data");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("This content is empty");
    }
  });

  it("should find one content", async() => {
    const res: ContentEntity = await service.findOne("azerty");
    expect(res.id).toBe("azerty");
    expect(res.data).toBeDefined();
  });

  it("should update a content", async() => {
    const res: ContentEntity = await service.update("azerty", {});
    expect(res.id).toBe("azerty");
    expect(res.data).toBeDefined();
  });
});