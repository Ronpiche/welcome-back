import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import type { CreateFeedbackDto } from "@modules/feedback/dto/create-feedback.dto";
import type { Feedback } from "@modules/feedback/entities/feedback.entity";

const feedback: Feedback = {
  _id: "1",
};
const createFeedbackDto: CreateFeedbackDto = {
  _id: "1",
};

describe("FeedbackService", () => {
  let service: FeedbackService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: FirestoreService,
          useValue: {
            getDoc: jest.fn().mockReturnValue(undefined),
            getAllDocuments: jest.fn().mockResolvedValue([feedback]),
            getDocument: jest.fn().mockResolvedValue(feedback),
            saveDocument: jest.fn().mockResolvedValue(feedback),
            updateDocument: jest.fn().mockResolvedValue(feedback),
            deleteRecursive: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a feedback when createUser is called.", async() => {
      const create = await service.create(createFeedbackDto);
      expect(create).toStrictEqual(feedback);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(createFeedbackDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return a feedback array when findAll is called.", async() => {
      const findAll = await service.findAll();
      expect(findAll).toStrictEqual([feedback]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll());
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a feedback when findOne is called.", async() => {
      const findOne = await service.findOne(feedback._id);
      expect(findOne).toStrictEqual(feedback);
    });

    it("should throw a NotFound when feedback does not exists.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedback._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedback._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("remove", () => {
    it("should delete a feedback when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteRecursive");
      await service.remove(feedback._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteRecursive").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(feedback._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a feedback when update is called.", async() => {
      const update = await service.update(feedback._id, createFeedbackDto);
      expect(update).toStrictEqual(feedback);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(feedback._id, createFeedbackDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});