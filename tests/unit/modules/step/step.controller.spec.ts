import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { StepController } from "@modules/step/step.controller";
import { StepService } from "@modules/step/step.service";
import type { Step } from "@src/modules/step/entities/step.entity";

const step: Step = {
  _id: "1",
  cutAt: 0,
  minDays: 30,
  maxDays: 90,
  unlockEmail: {
    subject: "Test",
    body: "1234",
  },
  subStep: [
    {
      _id: "1",
      isCompleted: false,
    },
  ],
};

describe("StepController", () => {
  let controller: StepController;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StepController],
      providers: [
        ConfigService,
        {
          provide: StepService,
          useValue: {
            create: jest.fn().mockResolvedValue(step),
            findAll: jest.fn().mockResolvedValue([step]),
            findOne: jest.fn().mockResolvedValue(step),
            update: jest.fn().mockResolvedValue(step),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<StepController>(StepController);
  });

  describe("create", () => {
    it("should create a step when create is called.", async() => {
      const create = await controller.create(step);
      expect(create).toStrictEqual(step);
    });
  });

  describe("findAll", () => {
    it("should return an array of step when findAll is called.", async() => {
      const findAll = await controller.findAll();
      expect(findAll).toStrictEqual([step]);
    });
  });

  describe("findOne", () => {
    it("should return a step when findOne is called.", async() => {
      const findOne = await controller.findOne(step._id);
      expect(findOne).toStrictEqual(step);
    });
  });

  describe("update", () => {
    it("should update a step when update is called.", async() => {
      const update = await controller.update(step._id, step);
      expect(update).toStrictEqual(step);
    });
  });

  describe("remove", () => {
    it("should delete a step when remove is called.", async() => {
      const spy = jest.spyOn(controller["stepService"], "remove");
      await controller.remove(step._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});