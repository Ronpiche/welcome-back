import { Timestamp } from "@google-cloud/firestore";
import { StepService } from "@modules/step/step.service";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { GipService } from "@src/services/gip/gip.service";
import { MailService } from "@src/services/mail/mail.service";
import { createFakeCreateUserDto } from "@tests/unit/factories/dtos/create-user.dto.factory";
import { createFakeStepEmail } from "@tests/unit/factories/entities/step-email.entity.factory";
import { createFakeStep } from "@tests/unit/factories/entities/step.entity.factory";
import { createFakeUserStep } from "@tests/unit/factories/entities/user-step.entity.factory";
import { createFakeWelcomeUser } from "@tests/unit/factories/entities/user.entity.factory";
import { getError, NoErrorThrownError } from "@tests/unit/utils";

const user = createFakeWelcomeUser({
  steps: [
    createFakeUserStep({
      _id: "1",
      subStepsCompleted: 1,
    }),
    createFakeUserStep({
      _id: "2",
      subStepsCompleted: 0,
    }),
    createFakeUserStep({
      _id: "3",
      subStepsCompleted: 0,
    }),
  ],
});

const createUserDto = createFakeCreateUserDto();
const steps = [
  createFakeStep({
    _id: "1",
    cutAt: 0.25,
    unlockEmail: undefined,
    maxDays: 90,
    minDays: 30,
    subSteps: 1,
    completionEmailManager: createFakeStepEmail(),
    completionEmail: undefined,
  }),
  createFakeStep({
    _id: "2",
    cutAt: 0.5,
    unlockEmail: { subject: "Test", body: "1234" },
    maxDays: 90,
    minDays: 30,
    subSteps: 1,
    completionEmail: undefined,
  }),
  createFakeStep({
    _id: "3",
    cutAt: 0.7,
    unlockEmail: { subject: "Test", body: "1234" },
    maxDays: 90,
    minDays: 30,
    subSteps: 1,
    completionEmail: createFakeStepEmail(),
  }),
];

describe("Welcome Service", () => {
  let mocks: {
    services: {
      welcome: {
        findAll: jest.SpyInstance;
      };
    };
  };
  let service: WelcomeService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelcomeService,
        {
          provide: MailService,
          useValue: {
            inviteNewUserMail: jest.fn().mockResolvedValue(undefined),
            sendStepMail: jest.fn().mockResolvedValue(undefined),
            sendStepMailToManager: jest.fn().mockResolvedValue(undefined),
            scheduleMail: jest.fn().mockResolvedValue(undefined),
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

    it("should generate a 12 characters password when generatePassword is called.", () => {
      const password = WelcomeService["generatePassword"]();

      expect(password).toHaveLength(12);
    });

    it("should throw an HttpException when generateSteps fails.", async() => {
      jest.spyOn(service["stepService"], "generateSteps").mockImplementation().mockRejectedValue(new HttpException("Invalid parameter: startDate > endDate", HttpStatus.BAD_REQUEST));
      const error: HttpException = await getError(async() => service.createUser(createUserDto));

      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(HttpException);
    });

    it("should throw an InternalServerError when mailer fails.", async() => {
      jest.spyOn(service["mailService"], "inviteNewUserMail").mockImplementation().mockRejectedValue(new Error());
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

    it("should correctly map steps when updating a user", async() => {
      const updatedUser = await service.update(user._id, createUserDto);
    
      expect(updatedUser.steps).toEqual(user.steps);
    });
    it("should throw an error if userInDb has no steps", async() => {
      jest.spyOn(service, "findOne").mockResolvedValueOnce({ ...user, steps: [] });
    
      const error = await getError(async() => service.update(user._id, createUserDto));
    
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("run", () => {
    beforeEach(() => {
      mocks = {
        services: {
          welcome: {
            findAll: jest.spyOn(service, "findAll").mockResolvedValue([user]),
          },
        },
      };
    });

    it("should send emails to newcomers with unlocked steps when run is called (no user).", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockResolvedValue([]);
      const run = await service.run(new Date());

      expect(run).toStrictEqual([]);
    });
  });

  describe("updateSubStep", () => {
    it("should complete user sub step when completeStep is called.", async() => {
      await service.updateSubStep(user._id, steps[1]._id, steps[1].subSteps);
      expect(service["firestoreService"].updateDocument).toHaveBeenCalledWith(
        FIRESTORE_COLLECTIONS.WELCOME_USERS,
        user._id,
        {
          steps: [user.steps[0], { ...user.steps[1], subStepsCompleted: steps[1].subSteps, completedAt: Timestamp.now() }, user.steps[2]],
        },
      );
    });
  });

  describe("updateEmailSteps", () => {
    it("should update email steps when updateEmailSteps is called.", async() => {
      await service["updateEmailSteps"](user, ["1"]);

      expect(service["firestoreService"].updateDocument).toHaveBeenCalledTimes(1);
      expect(service["firestoreService"].updateDocument).toHaveBeenCalledWith(
        FIRESTORE_COLLECTIONS.WELCOME_USERS,
        user._id,
        {
          steps: [
            { ...user.steps[0], unlockEmailSentAt: Timestamp.now() },
            user.steps[1],
            user.steps[2],
          ],
        },
      );
    });
  });

  describe("notifyCompletedStep", () => {
    it("should send completion mail when completion email is set.", async() => {
      await service["notifyCompletedStep"](user, steps[2]);

      expect(service["mailService"].sendStepMail).toHaveBeenCalledTimes(1);
      expect(service["mailService"].sendStepMail).toHaveBeenCalledWith(user, steps[2].completionEmail, "completion");
    });
  });
});