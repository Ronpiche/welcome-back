import { HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { MailerService } from "@nestjs-modules/mailer";
import { Timestamp } from "@google-cloud/firestore";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { StepService } from "@modules/step/step.service";
import type { WelcomeUser } from "@modules/welcome/entities/user.entity";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import type { CreateUserDto } from "@src/modules/welcome/dto/input/create-user.dto";
import { GRADE, PRACTICE } from "@src/modules/welcome/types/user.enum";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { GipService } from "@src/services/gip/gip.service";
import type { Step } from "@src/modules/step/entities/step.entity";

const user: WelcomeUser = {
  _id: "1",
  note: "",
  email: "john.doe@127.0.0.1",
  signupDate: "2022-04-24 22:00:00",
  firstName: "John",
  lastName: "Doe",
  civility: "M",
  agency: "Any",
  creationDate: Timestamp.fromDate(new Date("2022-04-25 13:24:06.627")),
  hrReferent: {
    _id: "abcd-1234",
    firstName: "Joe",
    lastName: "Bloggs",
    email: "joe.bloggs@127.0.0.1",
  },
  arrivalDate: "2023-02-01 22:00:00",
  lastUpdate: Timestamp.fromDate(new Date("2023-02-01 22:00:00")),
  grade: GRADE.PRACTIONNER,
  practice: PRACTICE.PRODUCT,
  steps: [
    {
      _id: "1",
      unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)),
      subStepsCompleted: 1,
    },
    {
      _id: "2",
      unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)),
      subStepsCompleted: 0,
    },
    {
      _id: "3",
      unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)),
      subStepsCompleted: 0,
    },
  ],
};
const createUserDto: CreateUserDto = {
  note: "",
  email: "john.doe@127.0.0.1",
  signupDate: "2022-04-24 22:00:00",
  firstName: "John",
  lastName: "Doe",
  civility: "M",
  agency: "Any",
  hrReferent: {
    _id: "abcd-1234",
    firstName: "Joe",
    lastName: "Bloggs",
    email: "joe.bloggs@127.0.0.1",
  },
  arrivalDate: "2023-02-01 22:00:00",
  grade: GRADE.PRACTIONNER,
  practice: PRACTICE.PRODUCT,
};
const steps: Step[] = [
  { _id: "1", cutAt: 0.25, unlockEmail: { subject: "Test", body: "1234" }, maxDays: 90, minDays: 30, subSteps: 1 },
  { _id: "2", cutAt: 0.5, unlockEmail: { subject: "Test", body: "1234" }, maxDays: 90, minDays: 30, subSteps: 1 },
  { _id: "3", cutAt: 0.7, unlockEmail: { subject: "Test", body: "1234" }, maxDays: 90, minDays: 30, subSteps: 1 },
];

describe("UsersService", () => {
  let service: WelcomeService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelcomeService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: StepService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(steps),
            findOne: jest.fn().mockResolvedValue(steps[0]),
            generateSteps: jest.fn().mockResolvedValue([{ step: { _id: "1" }, dt: new Date(2024, 5, 1) }]),
          },
        },
        {
          provide: FirestoreService,
          useValue: {
            getAllDocuments: jest.fn().mockResolvedValue([user]),
            getDocument: jest.fn().mockResolvedValue(user),
            saveDocument: jest.fn().mockResolvedValue(user),
            updateDocument: jest.fn().mockResolvedValue(user),
            deleteDocument: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: GipService,
          useValue: {
            createUser: jest.fn().mockResolvedValue({ uid: user._id }),
            deleteUser: jest.fn().mockResolvedValue(undefined),
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

    service = module.get<WelcomeService>(WelcomeService);
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 5, 1));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe("createUser", () => {
    it("should create an user when createUser is called.", async() => {
      const createUser = await service.createUser(createUserDto);
      expect(createUser).toStrictEqual(user);
    });

    it("should throw an HttpException when generateSteps fails.", async() => {
      jest.spyOn(service["stepService"], "generateSteps").mockImplementation().mockRejectedValue(new HttpException("Invalid parameter: startDate > endDate", HttpStatus.BAD_REQUEST));
      const error: HttpException = await getError(async() => service.createUser(createUserDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(HttpException);
    });

    it("should throw an InternalServerError when mailer fails.", async() => {
      jest.spyOn(service["mailerService"], "sendMail").mockImplementation().mockRejectedValue(new Error());
      const error: InternalServerErrorException = await getError(async() => service.createUser(createUserDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });

    it("should throw an InternalServerError when gip fails.", async() => {
      jest.spyOn(service["gipService"], "createUser").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.createUser(createUserDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.createUser(createUserDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return an user array when findAll is called (without filter).", async() => {
      const findAll = await service.findAll();
      expect(findAll).toStrictEqual([user]);
    });

    it("should return an user array when findAll is called (with filters).", async() => {
      const findAll = await service.findAll(new Date(), new Date());
      expect(findAll).toStrictEqual([user]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll());
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return an user when findOne is called.", async() => {
      const findOne = await service.findOne(user._id);
      expect(findOne).toStrictEqual(user);
    });

    it("should throw a NotFound when user does not exists.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(user._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(user._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("remove", () => {
    it("should delete an user when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteDocument");
      await service.remove(user._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(user._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update an user when update is called.", async() => {
      const update = await service.update(user._id, createUserDto);
      expect(update).toStrictEqual(user);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(user._id, createUserDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("run", () => {
    it("should send emails to newcommers with unlocked steps when run is called (no user).", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockResolvedValue([]);
      const run = await service.run(new Date());
      expect(run).toStrictEqual([]);
    });

    it("should send emails to newcommers with unlocked steps when run is called (some users).", async() => {
      const run = await service.run(new Date());
      expect(run).toStrictEqual([{ status: "fulfilled", value: { _id: user._id } }]);
    });

    it("should return rejected when emails cannot be send.", async() => {
      jest.spyOn(service["mailerService"], "sendMail").mockImplementation().mockRejectedValue(new Error("test"));
      const run = await service.run(new Date());
      expect(run).toStrictEqual([{ status: "rejected", reason: { _id: user._id, message: "test" } }]);
    });
  });

  describe("incrementSubStep", () => {
    it("should complete user sub step when completeStep is called.", async() => {
      await service.incrementSubStep(user._id, steps[1]._id);
      expect(service["firestoreService"].updateDocument).toHaveBeenCalledWith(
        FIRESTORE_COLLECTIONS.WELCOME_USERS,
        user._id,
        {
          steps: [user.steps[0], { ...user.steps[1], subStepsCompleted: 1, completedAt: Timestamp.now() }, user.steps[2]],
        },
      );
    });
  });
});