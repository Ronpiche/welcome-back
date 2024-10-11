import type { HttpException } from "@nestjs/common";
import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { QuizService } from "@modules/quiz/quiz.service";
import type { Quiz } from "@modules/quiz/entities/quiz.entity";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { NoErrorThrownError, getError } from "@tests/unit/utils";

const quizEntityMock: Quiz = {
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
const quizCorrectAnswers: Parameters<QuizService["checkCorrectness"]>[2] = [2, 4];
const quizSomeCorrectAnswers: Parameters<QuizService["checkCorrectness"]>[2] = [0, 2];
const serviceMock = {
  FirestoreService: (): Partial<FirestoreService> => ({
    getAllDocuments: jest.fn().mockResolvedValue([quizEntityMock]),
    getDocument: jest.fn().mockResolvedValue(quizEntityMock),
    saveDocument: jest.fn().mockResolvedValue(quizEntityMock),
    updateDocument: jest.fn().mockResolvedValue(quizEntityMock),
    deleteDocument: jest.fn().mockResolvedValue(undefined),
  }),
};

describe("QuizService", () => {
  let service: QuizService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: FirestoreService,
          useFactory: serviceMock.FirestoreService,
        },
        {
          provide: Logger,
          useFactory: jest.fn,
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should return documentId when create is called.", async() => {
      const create = await service.create(quizEntityMock);
      expect(create).toStrictEqual(quizEntityMock);
    });

    it("should throw when create and quiz already exists (409).", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new ConflictException());
      const error: HttpException = await getError(async() => service.create(quizEntityMock));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.getStatus()).toBe(409);
    });

    it("should throw when create is called and database fails (500).", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(quizEntityMock));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.getStatus()).toBe(500);
    });
  });

  describe("findAll", () => {
    it("should return the list of quizzes when findAll is called.", async() => {
      const findAll = await service.findAll();
      expect(findAll).toStrictEqual([quizEntityMock]);
    });

    it("should throw when findAll fails (500).", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll());
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.getStatus()).toBe(500);
    });
  });

  describe("findOne", () => {
    it("should return a quiz object when findOne is called.", async() => {
      const findOne = await service.findOne(quizEntityMock._id);
      expect(findOne).toStrictEqual(quizEntityMock);
    });

    it("should throw when the quiz doesn't exists (404).", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: HttpException = await getError(async() => service.findOne(quizEntityMock._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.getStatus()).toBe(404);
    });

    it("should throw when database fails (500).", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(quizEntityMock._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.getStatus()).toBe(500);
    });
  });

  describe("remove", () => {
    it("should remove when remove is called.", async() => {
      await expect(service.remove(quizEntityMock._id)).resolves.toBeUndefined();
    });

    it("should throw when database fails (500).", async() => {
      jest.spyOn(service["firestoreService"], "deleteDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(quizEntityMock._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.getStatus()).toBe(500);
    });
  });

  describe("update", () => {
    it("should update when update is called.", async() => {
      const update = await service.update(quizEntityMock._id, quizEntityMock);
      expect(update).toStrictEqual(quizEntityMock);
    });

    it("should throw when the quiz doesn't exists (404).", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: HttpException = await getError(async() => service.update(quizEntityMock._id, quizEntityMock));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.getStatus()).toBe(404);
    });

    it("should throw when database fails (500).", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(quizEntityMock._id, quizEntityMock));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.getStatus()).toBe(500);
    });
  });

  describe("checkCorrectness", () => {
    it("should returns intersection of correct and given answers (all corrects).", async() => {
      const checkCorrectness = await service.checkCorrectness(quizEntityMock._id, 0, quizCorrectAnswers);
      expect(checkCorrectness).toStrictEqual(quizCorrectAnswers);
    });

    it("should returns intersection of correct and given answers (some corrects).", async() => {
      const checkCorrectness = await service.checkCorrectness(quizEntityMock._id, 0, quizSomeCorrectAnswers);
      expect(checkCorrectness).toStrictEqual(quizSomeCorrectAnswers.filter(value => quizCorrectAnswers.includes(value)));
    });

    it("should returns intersection of correct and given answers (all incorrects).", async() => {
      const checkCorrectness = await service.checkCorrectness(quizEntityMock._id, 0, [-1]);
      expect(checkCorrectness).toStrictEqual([]);
    });

    it("should throw when the quiz doesn't exists (404).", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation()
        .mockRejectedValue(new NotFoundException());
      const error: HttpException = await getError(async() => service.checkCorrectness(quizEntityMock._id, 0, quizCorrectAnswers));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.getStatus()).toBe(404);
    });

    it("should throw when database fails (500).", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.checkCorrectness(quizEntityMock._id, 0, quizCorrectAnswers));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.getStatus()).toBe(500);
    });
  });
});