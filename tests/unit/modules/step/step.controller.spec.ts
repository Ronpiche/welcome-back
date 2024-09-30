import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AccessGuard } from "@src/middleware/AuthGuard";
import { JwtCognito } from "@modules/cognito/jwtCognito.service";
import { CognitoServiceMock } from "@tests/unit/__mocks__/cognito/cognito.service.mock";
import { LoggerMock } from "@tests/unit/__mocks__/logger.mock";
import { StepController } from "@modules/step/step.controller";
import { StepService } from "@modules/step/step.service";
import { StepServiceMock } from "@tests/unit/__mocks__/step/step.service.mock";
import { stepEntityMock } from "@tests/unit/__mocks__/step/Step.entity.mock";

describe("StepController", () => {
  let controller: StepController;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StepController],
      providers: [
        JwtService,
        ConfigService,
        AccessGuard,
        { provide: JwtCognito, useClass: CognitoServiceMock },
        { provide: StepService, useClass: StepServiceMock },
        { provide: Logger, useClass: LoggerMock },
      ],
    }).compile();

    controller = module.get<StepController>(StepController);
  });

  describe("create", () => {
    it("should create a step object", async() => {
      const step = await controller.create(stepEntityMock);
      expect(step).toEqual({ status: "OK", _id: stepEntityMock._id });
    });
  });

  describe("findAll", () => {
    it("should return an array of step object", async() => {
      const users = await controller.findAll();
      expect(users).toEqual([stepEntityMock]);
    });
  });

  describe("FindOne", () => {
    it("should return a step object", async() => {
      const user = await controller.findOne(stepEntityMock._id);
      expect(user).toEqual(stepEntityMock);
    });
  });

  describe("remove", () => {
    it("should delete a step object", async() => {
      const res = await controller.remove(stepEntityMock._id);
      expect(res).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update a step object", async() => {
      const step = await controller.update(stepEntityMock._id, stepEntityMock);
      expect(step).toEqual(stepEntityMock);
    });
  });
});