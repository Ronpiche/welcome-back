import { Test } from "@nestjs/testing";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { StepService } from "@modules/step/step.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import type { Step } from "@src/modules/step/entities/step.entity";
import { NoErrorThrownError, getError } from "@tests/unit/utils";

const step: Step = {
  _id: "1",
  cutAt: 0,
  minDays: 30,
  maxDays: 90,
  unlockEmail: {
    subject: "Test",
    body: "1234",
  },
  subSteps: 1,
};

describe("StepService", () => {
  let service: StepService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        StepService,
        {
          provide: FirestoreService,
          useValue: {
            getAllDocuments: jest.fn().mockResolvedValue([step]),
            getDocument: jest.fn().mockResolvedValue(step),
            saveDocument: jest.fn().mockResolvedValue(step),
            updateDocument: jest.fn().mockResolvedValue(step),
            deleteDocument: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            secure: jest.fn(),
            isLevelEnabled: jest.fn(() => false),
          },
        },
      ],
    }).compile();

    service = module.get<StepService>(StepService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a step when create is called.", async() => {
      const create = await service.create(step);
      expect(create).toStrictEqual(step);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(step));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return an array of steps when findAll is called.", async() => {
      const findAll = await service.findAll();
      expect(findAll).toStrictEqual([step]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll());
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a step when findOne is called.", async() => {
      const findOne = await service.findOne(step._id);
      expect(findOne).toStrictEqual(step);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(step._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("delete", () => {
    it("should delete a step when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteDocument");
      await service.remove(step._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(step._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a step when update is called.", async() => {
      const update = await service.update(step._id, step);
      expect(update).toStrictEqual(step);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(step._id, step));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("generateSteps", () => {
    it("should generate steps when generateSteps is called.", async() => {
      const generateSteps = await service.generateSteps(new Date(2024, 0, 2), new Date(2024, 1, 15));
      expect(generateSteps).toStrictEqual([{ step, dt: new Date(2024, 0, 2) }]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.generateSteps(new Date(2024, 0, 2), new Date(2024, 1, 15)));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});