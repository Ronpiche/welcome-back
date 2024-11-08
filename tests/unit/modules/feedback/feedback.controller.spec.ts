import { Test } from "@nestjs/testing";
import { FeedbackController } from "@modules/feedback/feedback.controller";
import { FeedbackService } from "@modules/feedback/feedback.service";
import type { Feedback } from "@src/modules/feedback/entities/feedback.entity";
import type { CreateFeedbackDto } from "@src/modules/feedback/dto/create-feedback.dto";

const feedback: Feedback = {
  _id: "1",
};
const createFeedbackDto: CreateFeedbackDto = {
  _id: "1",
};

describe("FeedbackController", () => {
  let controller: FeedbackController;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: {
            create: jest.fn().mockResolvedValue(feedback),
            findAll: jest.fn().mockResolvedValue([feedback]),
            findOne: jest.fn().mockResolvedValue(feedback),
            remove: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(feedback),
          },
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  describe("create", () => {
    it("should create a feedback when create is called.", async() => {
      const create = await controller.create(createFeedbackDto);
      expect(create).toStrictEqual(feedback);
    });
  });

  describe("findAll", () => {
    it("should return a feedback array when findAll is called.", async() => {
      const findAll = await controller.findAll();
      expect(findAll).toStrictEqual([feedback]);
    });
  });

  describe("findOne", () => {
    it("should return a feedback when findOne is called.", async() => {
      const findOne = await controller.findOne(feedback._id);
      expect(findOne).toStrictEqual(feedback);
    });
  });

  describe("remove", () => {
    it("should delete a feedback when remove is called.", async() => {
      const spy = jest.spyOn(controller["feedbackService"], "remove");
      await controller.remove(feedback._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update a feedback when update is called.", async() => {
      const update = await controller.update(feedback._id, createFeedbackDto);
      expect(update).toStrictEqual(feedback);
    });
  });
});