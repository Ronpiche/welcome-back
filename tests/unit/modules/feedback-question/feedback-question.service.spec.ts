import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { FeedbackQuestionService } from "@modules/feedback-question/feedback-question.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import type { CreateFeedbackQuestionDto } from "@modules/feedback-question/dto/create-feedback-question.dto";
import type { FeedbackQuestion } from "@modules/feedback-question/entities/feedback-question.entity";
import { QuestionType } from "@modules/feedback-question/types/question-type.enum";

const feedbackId = "1";
const feedbackQuestion: FeedbackQuestion = {
  _id: "1",
  label: "Test",
  type: QuestionType.FREE,
  answers: [],
  minNumberOfAnswers: 1,
  maxNumberOfAnswers: 1,
};
const createFeedbackQuestionDto: CreateFeedbackQuestionDto = {
  label: "Test",
  type: QuestionType.FREE,
  answers: [],
  minNumberOfAnswers: 1,
  maxNumberOfAnswers: 1,
};

describe("FeedbackQuestionService", () => {
  let service: FeedbackQuestionService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        FeedbackQuestionService,
        {
          provide: FirestoreService,
          useValue: {
            getDoc: jest.fn().mockReturnValue(undefined),
            getAllDocuments: jest.fn().mockResolvedValue([feedbackQuestion]),
            getDocument: jest.fn().mockResolvedValue(feedbackQuestion),
            saveDocument: jest.fn().mockResolvedValue(feedbackQuestion),
            updateDocument: jest.fn().mockResolvedValue(feedbackQuestion),
            deleteRecursive: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<FeedbackQuestionService>(FeedbackQuestionService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a feedback question when createUser is called.", async() => {
      const create = await service.create(feedbackId, createFeedbackQuestionDto);
      expect(create).toStrictEqual(feedbackQuestion);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(feedbackId, createFeedbackQuestionDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return a feedback question array when findAll is called.", async() => {
      const findAll = await service.findAll(feedbackId);
      expect(findAll).toStrictEqual([feedbackQuestion]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll(feedbackId));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a feedback question when findOne is called.", async() => {
      const findOne = await service.findOne(feedbackId, feedbackQuestion._id);
      expect(findOne).toStrictEqual(feedbackQuestion);
    });

    it("should throw a NotFound when feedback question does not exists.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedbackId, feedbackQuestion._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(feedbackId, feedbackQuestion._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("remove", () => {
    it("should delete a feedback question when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteRecursive");
      await service.remove(feedbackId, feedbackQuestion._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteRecursive").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(feedbackId, feedbackQuestion._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a feedback question when update is called.", async() => {
      const update = await service.update(feedbackId, feedbackQuestion._id, createFeedbackQuestionDto);
      expect(update).toStrictEqual(feedbackQuestion);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(feedbackId, feedbackQuestion._id, createFeedbackQuestionDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});