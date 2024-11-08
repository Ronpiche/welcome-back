import { Test } from "@nestjs/testing";
import { FeedbackQuestionController } from "@modules/feedback-question/feedback-question.controller";
import { FeedbackQuestionService } from "@modules/feedback-question/feedback-question.service";
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

describe("FeedbackQuestionController", () => {
  let controller: FeedbackQuestionController;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      controllers: [FeedbackQuestionController],
      providers: [
        {
          provide: FeedbackQuestionService,
          useValue: {
            create: jest.fn().mockResolvedValue(feedbackQuestion),
            findAll: jest.fn().mockResolvedValue([feedbackQuestion]),
            findOne: jest.fn().mockResolvedValue(feedbackQuestion),
            remove: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(feedbackQuestion),
          },
        },
      ],
    }).compile();

    controller = module.get<FeedbackQuestionController>(FeedbackQuestionController);
  });

  describe("create", () => {
    it("should create a feedback question when create is called.", async() => {
      const create = await controller.create(feedbackId, createFeedbackQuestionDto);
      expect(create).toStrictEqual(feedbackQuestion);
    });
  });

  describe("findAll", () => {
    it("should return a feedback question array when findAll is called.", async() => {
      const findAll = await controller.findAll(feedbackId);
      expect(findAll).toStrictEqual([feedbackQuestion]);
    });
  });

  describe("findOne", () => {
    it("should return a feedback question when findOne is called.", async() => {
      const findOne = await controller.findOne(feedbackId, feedbackQuestion._id);
      expect(findOne).toStrictEqual(feedbackQuestion);
    });
  });

  describe("remove", () => {
    it("should delete a feedback question when remove is called.", async() => {
      const spy = jest.spyOn(controller["feedbackQuestionService"], "remove");
      await controller.remove(feedbackId, feedbackQuestion._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update a feedback question when update is called.", async() => {
      const update = await controller.update(feedbackId, feedbackQuestion._id, createFeedbackQuestionDto);
      expect(update).toStrictEqual(feedbackQuestion);
    });
  });
});