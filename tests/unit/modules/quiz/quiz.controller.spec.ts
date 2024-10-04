import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AccessGuard } from "@src/middleware/AuthGuard";
import { JwtCognito } from "@modules/cognito/jwtCognito.service";
import { QuizController } from "@modules/quiz/quiz.controller";
import { QuizService } from "@modules/quiz/quiz.service";
import type { QuizUserAnswerDto } from "@modules/quiz/dto/quiz-user-answer.dto";
import type { CreateQuizDto } from "@src/modules/quiz/dto/create-quiz.dto";
import type { UpdateQuizDto } from "@src/modules/quiz/dto/update-quiz.dto";

const createQuizMock: CreateQuizDto = {
  _id: "mockedId",
  questions: [
    {
      label: "How many are 1 + 1 ?",
      answers: [
        {
          label: "0",
          isTrue: false,
        },
        {
          label: "1",
          isTrue: false,
        },
        {
          label: "2",
          isTrue: true,
        },
        {
          label: "3",
          isTrue: false,
        },
        {
          label: "4/2",
          isTrue: true,
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
          isTrue: true,
        },
        {
          label: "1",
          isTrue: false,
        },
        {
          label: "2",
          isTrue: false,
        },
        {
          label: "3",
          isTrue: false,
        },
        {
          label: "4/2",
          isTrue: false,
        },
      ],
    },
  ],
};
const quizValidAnswer: QuizUserAnswerDto = { questionIndex: 0, answerIndexes: [2, 4] };
const serviceMock = {
  QuizService: (): Partial<QuizService> => ({
    create: jest.fn().mockResolvedValue(createQuizMock),
    findAll: jest.fn().mockResolvedValue([createQuizMock]),
    findOne: jest.fn().mockResolvedValue(createQuizMock),
    update: jest.fn().mockResolvedValue(updateQuizMock),
    remove: jest.fn().mockResolvedValue(undefined),
    isValid: jest.fn().mockResolvedValue(true),
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
    it("should check validity when isValid is called.", async() => {
      const isValid = await controller.isValid(createQuizMock._id, quizValidAnswer);
      expect(isValid).toBe(true);
    });
  });
});