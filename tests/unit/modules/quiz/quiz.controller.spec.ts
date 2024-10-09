import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AccessGuard } from "@src/middleware/AuthGuard";
import { JwtCognito } from "@modules/cognito/jwtCognito.service";
import { QuizController } from "@modules/quiz/quiz.controller";
import { QuizService } from "@modules/quiz/quiz.service";
import type { CreateQuizDto } from "@src/modules/quiz/dto/create-quiz.dto";
import type { UpdateQuizDto } from "@src/modules/quiz/dto/update-quiz.dto";
import { OutputSafeQuizDto } from "@src/modules/quiz/dto/output-safe-quiz.dto";
import { plainToInstance } from "class-transformer";

const createQuizMock: CreateQuizDto = {
  _id: "mockedId",
  questions: [
    {
      label: "How many are 1 + 1 ?",
      answers: [
        {
          label: "0",
          isCorrect: false,
        },
        {
          label: "1",
          isCorrect: false,
        },
        {
          label: "2",
          isCorrect: true,
        },
        {
          label: "3",
          isCorrect: false,
        },
        {
          label: "4/2",
          isCorrect: true,
        },
      ],
    },
  ],
};
const updateQuizMock: UpdateQuizDto = {
  questions: [
    {
      label: "How many are 1 - 1 ?",
      answers: [
        {
          label: "0",
          isCorrect: true,
        },
        {
          label: "1",
          isCorrect: false,
        },
        {
          label: "2",
          isCorrect: false,
        },
        {
          label: "3",
          isCorrect: false,
        },
        {
          label: "4/2",
          isCorrect: false,
        },
      ],
    },
  ],
};
const safeQuiz = plainToInstance(OutputSafeQuizDto, {
  _id: "mockedId",
  questions: [
    {
      label: "How many are 1 + 1 ?",
      answers: [
        {
          label: "0",
        },
        {
          label: "1",
        },
        {
          label: "2",
        },
        {
          label: "3",
        },
        {
          label: "4/2",
        },
      ],
      numberOfCorrectAnswers: 2,
    },
  ],
});
const quizCorrectAnswers: Parameters<QuizController["checkCorrectness"]>[2] = [2, 4];
const serviceMock = {
  QuizService: (): Partial<QuizService> => ({
    create: jest.fn().mockResolvedValue(createQuizMock),
    findAll: jest.fn().mockResolvedValue([createQuizMock]),
    findOne: jest.fn().mockResolvedValue(createQuizMock),
    update: jest.fn().mockResolvedValue(updateQuizMock),
    remove: jest.fn().mockResolvedValue(undefined),
    checkCorrectness: jest.fn().mockResolvedValue(quizCorrectAnswers),
  }),
};

describe("QuizController", () => {
  let controller: QuizController;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        JwtService,
        ConfigService,
        AccessGuard,
        { provide: JwtCognito, useFactory: jest.fn },
        { provide: QuizService, useFactory: serviceMock.QuizService },
        { provide: Logger, useFactory: jest.fn },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
  });

  describe("create", () => {
    it("should return documentId when create is called.", async() => {
      const create = await controller.create(createQuizMock);
      expect(create).toStrictEqual(createQuizMock);
    });
  });

  describe("findAll", () => {
    it("should return the list of quizzes when findAll is called.", async() => {
      const findAll = await controller.findAll();
      expect(findAll).toStrictEqual([createQuizMock]);
    });
  });

  describe("findOne", () => {
    it("should return a quiz object when findOne is called.", async() => {
      const findOne = await controller.findOne(createQuizMock._id);
      expect(findOne).toStrictEqual(createQuizMock);
    });
  });

  describe("findOneSafe", () => {
    it("should return a safe quiz object when findOneSafe is called.", async() => {
      const findOneSafe = await controller.findOneSafe(createQuizMock._id);
      expect(findOneSafe).toStrictEqual(safeQuiz);
    });
  });

  describe("remove", () => {
    it("should remove when remove is called.", async() => {
      await expect(controller.remove(createQuizMock._id)).resolves.toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update when update is called.", async() => {
      const update = await controller.update(createQuizMock._id, updateQuizMock);
      expect(update).toStrictEqual(updateQuizMock);
    });
  });

  describe("isValid", () => {
    it("should check answer correctness when checkCorrectness is called.", async() => {
      const isValid = await controller.checkCorrectness(createQuizMock._id, 0, quizCorrectAnswers);
      expect(isValid).toBe(quizCorrectAnswers);
    });
  });
});