import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { PracticeService } from "@modules/practice/practice.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { createFakeCreatePracticeDto } from "@tests/unit/factories/dtos/create-practice.dto.factory";
import { createFakePractice } from "@tests/unit/factories/entities/practice.entity.factory";

const practice = createFakePractice();
const createPracticeDto = createFakeCreatePracticeDto();

describe("PracticeService", () => {
  let service: PracticeService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        PracticeService,
        {
          provide: FirestoreService,
          useValue: {
            getAllDocuments: jest.fn().mockResolvedValue([practice]),
            getDocument: jest.fn().mockResolvedValue(practice),
            saveDocument: jest.fn().mockResolvedValue(practice),
            updateDocument: jest.fn().mockResolvedValue(practice),
            deleteDocument: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<PracticeService>(PracticeService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a practice when create is called.", async() => {
      const create = await service.create(createPracticeDto);
      expect(create).toStrictEqual(practice);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(createPracticeDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return a practice array when findAll is called.", async() => {
      const findAll = await service.findAll();
      expect(findAll).toStrictEqual([practice]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll());
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a practice when findOne is called.", async() => {
      const findOne = await service.findOne(practice._id);
      expect(findOne).toStrictEqual(practice);
    });

    it("should throw a NotFound when practice does not exists.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(practice._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(practice._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("remove", () => {
    it("should delete a practice when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteDocument");
      await service.remove(practice._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(practice._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a practice when update is called.", async() => {
      const update = await service.update(practice._id, createPracticeDto);
      expect(update).toStrictEqual(practice);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(practice._id, createPracticeDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});