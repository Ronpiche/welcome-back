import { Test } from "@nestjs/testing";
import { FeedbackAnswerController } from "@src/modules/feedback-answer/feedback-answer.controller";
import { FeedbackAnswerService } from "@src/modules/feedback-answer/feedback-answer.service";
import type { FeedbackAnswer } from "@src/modules/feedback-answer/entities/feedback-answer.entity";
import type { UserRequest } from "@src/guards/jwt.guard";
import { Role } from "@src/decorators/role";

const user: UserRequest = {
  user: {
    id: "1",
    email: "",
    role: Role.USER,
  },
};
const feedbackId = "1";
const feedbackQuestionId = "1";
const feedbackAnswer: FeedbackAnswer = {
  _id: "1",
  answers: [],
};
const createFeedbackAnswerDto: string[] = ["a", "b"];

describe("FeedbackAnswerController", () => {
  let controller: FeedbackAnswerController;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      controllers: [FeedbackAnswerController],
      providers: [
        {
          provide: FeedbackAnswerService,
          useValue: {
            create: jest.fn().mockResolvedValue(feedbackAnswer),
            findAll: jest.fn().mockResolvedValue([feedbackAnswer]),
            findOne: jest.fn().mockResolvedValue(feedbackAnswer),
            remove: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(feedbackAnswer),
          },
        },
      ],
    }).compile();

    controller = module.get<FeedbackAnswerController>(FeedbackAnswerController);
  });

  describe("createForMe", () => {
    it("should create a feedback answer when createForMe is called.", async() => {
      const createForMe = await controller.createForMe(feedbackId, feedbackQuestionId, user, createFeedbackAnswerDto);
      expect(createForMe).toStrictEqual(feedbackAnswer);
    });
  });

  describe("create", () => {
    it("should create a feedback answer when create is called.", async() => {
      const create = await controller.create(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto);
      expect(create).toStrictEqual(feedbackAnswer);
    });
  });

  describe("findAll", () => {
    it("should return a feedback answer array when findAll is called.", async() => {
      const findAll = await controller.findAll(feedbackId, feedbackQuestionId);
      expect(findAll).toStrictEqual([feedbackAnswer]);
    });
  });

  describe("findMine", () => {
    it("should return a feedback answer when findMine is called.", async() => {
      const findMine = await controller.findMine(feedbackId, feedbackQuestionId, user);
      expect(findMine).toStrictEqual(feedbackAnswer);
    });
  });

  describe("findOne", () => {
    it("should return a feedback answer when findOne is called.", async() => {
      const findOne = await controller.findOne(feedbackId, feedbackQuestionId, feedbackAnswer._id);
      expect(findOne).toStrictEqual(feedbackAnswer);
    });
  });

  describe("remove", () => {
    it("should delete a feedback answer when remove is called.", async() => {
      const spy = jest.spyOn(controller["feedbackAnswerService"], "remove");
      await controller.remove(feedbackId, feedbackQuestionId, feedbackAnswer._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update a feedback answer when update is called.", async() => {
      const update = await controller.update(feedbackId, feedbackQuestionId, feedbackAnswer._id, createFeedbackAnswerDto);
      expect(update).toStrictEqual(feedbackAnswer);
    });
  });
});