import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { FeedbackAnswerService } from "@modules/feedback-answer/feedback-answer.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import type { FeedbackAnswer } from "@modules/feedback-answer/entities/feedback-answer.entity";

const feedbackId = "1";
const feedbackQuestionId = "1";
const feedbackAnswer: FeedbackAnswer = {
  _id: "1",
  answers: [],
};
const createFeedbackAnswerDto: string[] = ["a", "b"];

describe("FeedbackAnswerService", () => {
  let service: FeedbackAnswerService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        FeedbackAnswerService,
        {
          provide: FirestoreService,
          useValue: {
            getDoc: jest.fn().mockReturnValue(undefined),
            getAllDocuments: jest.fn().mockResolvedValue([feedbackAnswer]),
            getDocument: jest.fn().mockResolvedValue(feedbackAnswer),
            saveDocument: jest.fn().mockResolvedValue(feedbackAnswer),
            updateDocument: jest.fn().mockResolvedValue(feedbackAnswer),
            deleteDocument: jest.fn().mockResolvedValue(undefined),
            deleteCollection: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<FeedbackAnswerService>(FeedbackAnswerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a feedback answer when createUser is called.", async() => {
      const create = await service.create(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto);
      expect(create).toStrictEqual(feedbackAnswer);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return a feedback answer array when findAll is called.", async() => {
      const findAll = await service.findAll(feedbackId, feedbackQuestionId);
      expect(findAll).toStrictEqual([feedbackAnswer]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll(feedbackId, feedbackQuestionId));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a feedback answer when findOne is called.", async() => {
      const findOne = await service.findOne(feedbackId, feedbackQuestionId, feedbackAnswer._id);
      expect(findOne).toStrictEqual(feedbackAnswer);
    });

    it("should throw a NotFound when feedback answer does not exists.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedbackId, feedbackQuestionId, feedbackAnswer._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedbackId, feedbackQuestionId, feedbackAnswer._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("remove", () => {
    it("should delete a feedback answer when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteDocument");
      await service.remove(feedbackId, feedbackQuestionId, feedbackAnswer._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(feedbackId, feedbackQuestionId, feedbackAnswer._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a feedback answer when update is called.", async() => {
      const update = await service.update(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto);
      expect(update).toStrictEqual(feedbackAnswer);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});