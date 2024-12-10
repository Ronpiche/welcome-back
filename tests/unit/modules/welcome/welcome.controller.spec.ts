import { WelcomeController } from "@modules/welcome/welcome.controller";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { Test } from "@nestjs/testing";
import type { Response } from "express";
import { plainToInstance } from "class-transformer";
import { Timestamp } from "@google-cloud/firestore";
import { Practice } from "@src/modules/welcome/types/user.enum";
import type { CreateUserDto } from "@src/modules/welcome/dto/input/create-user.dto";
import { WelcomeUserDto } from "@src/modules/welcome/dto/output/welcome-user.dto";
import type { WelcomeUser } from "@src/modules/welcome/entities/user.entity";
import { Role } from "@src/decorators/role";
import type { UserRequest } from "@src/guards/jwt.guard";

const userReq: UserRequest = {
  user: {
    id: "1",
    email: "",
    role: Role.USER,
  },
};
const user: WelcomeUser = {
  _id: "1",
  note: "",
  email: "john.doe@127.0.0.1",
  signupDate: "2022-04-24 22:00:00",
  firstName: "John",
  lastName: "Doe",
  agency: "Any",
  creationDate: Timestamp.fromDate(new Date("2022-04-25 13:24:06.627")),
  hrReferent: {
    firstName: "Joe",
    lastName: "Bloggs",
    email: "joe.bloggs@127.0.0.1",
  },
  arrivalDate: "2023-02-01 22:00:00",
  lastUpdate: Timestamp.fromDate(new Date("2023-02-01 22:00:00")),
  practices: [Practice.PRODUCT],
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
const userDto = plainToInstance(WelcomeUserDto, {
  _id: "1",
  note: "",
  email: "john.doe@127.0.0.1",
  signupDate: "2022-04-24 22:00:00",
  firstName: "John",
  lastName: "Doe",
  agency: "Any",
  creationDate: new Date("2022-04-25 13:24:06.627"),
  hrReferent: {
    firstName: "Joe",
    lastName: "Bloggs",
    email: "joe.bloggs@127.0.0.1",
  },
  arrivalDate: "2023-02-01 22:00:00",
  lastUpdate: new Date("2023-02-01 22:00:00"),
  practices: [Practice.PRODUCT],
  steps: [
    {
      _id: "1",
      unlockDate: new Date(2022, 4, 25, 13, 24, 6),
      subStepsCompleted: 1,
    },
    {
      _id: "2",
      unlockDate: new Date(2022, 4, 25, 13, 24, 6),
      subStepsCompleted: 0,
    },
    {
      _id: "3",
      unlockDate: new Date(2022, 4, 25, 13, 24, 6),
      subStepsCompleted: 0,
    },
  ],
});
const createUserDto: CreateUserDto = {
  note: "",
  email: "john.doe@127.0.0.1",
  signupDate: "2022-04-24 22:00:00",
  firstName: "John",
  lastName: "Doe",
  agency: "Any",
  hrReferent: {
    firstName: "Joe",
    lastName: "Bloggs",
    email: "joe.bloggs@127.0.0.1",
  },
  arrivalDate: "2023-02-01 22:00:00",
  practices: [Practice.PRODUCT],
};

describe("Welcome controller", () => {
  let controller: WelcomeController;
  const response = {
    get statusCode() {
      return this._status;
    },
    status(s: number) {
      this._status = s;

      return this;
    },
    _status: 201,
  } as unknown as Response;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      controllers: [WelcomeController],
      providers: [
        {
          provide: WelcomeService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(user),
            findAll: jest.fn().mockResolvedValue([user]),
            findOne: jest.fn().mockResolvedValue(user),
            remove: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(user),
            run: jest.fn().mockResolvedValue([{ status: "fulfilled", value: { _id: "1" } }]),
            incrementSubStep: jest.fn().mockResolvedValue(user.steps),
          },
        },
      ],
    }).compile();

    controller = module.get<WelcomeController>(WelcomeController);
  });

  describe("create", () => {
    it("should create an user when create is called.", async() => {
      const create = await controller.create(createUserDto);
      expect(create).toStrictEqual(userDto);
    });
  });

  describe("findAll", () => {
    it("should return an array when findAll is called without filters.", async() => {
      const findAll = await controller.findAll();
      expect(findAll).toStrictEqual([userDto]);
    });

    it("should return an array when findAll is called with filters.", async() => {
      const findAll = await controller.findAll(new Date(), new Date());
      expect(findAll).toStrictEqual([userDto]);
    });
  });

  describe("findOne", () => {
    it("should return an user when findOne is called.", async() => {
      const findOne = await controller.findOne(user._id);
      expect(findOne).toStrictEqual(userDto);
    });
  });

  describe("remove", () => {
    it("should delete an user when remove is called.", async() => {
      const spy = jest.spyOn(controller["welcomeService"], "remove");
      await controller.remove(user._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update an user when update is called.", async() => {
      const update = await controller.update(user._id, createUserDto);
      expect(update).toStrictEqual(userDto);
    });
  });

  describe("run", () => {
    it("should launch the task and return the result when run is called (OK).", async() => {
      const run = await controller.run(response);
      expect(response.statusCode).toBe(201);
      expect(run).toStrictEqual([{ status: "fulfilled", value: { _id: "1" } }]);
    });

    it("should launch the task and return the result when run is called (KO).", async() => {
      jest.spyOn(controller["welcomeService"], "run").mockImplementation()
        .mockResolvedValue([{ status: "rejected", reason: { _id: "1", error: "unknown" } }]);
      const run = await controller.run(response);
      expect(response.statusCode).toBe(500);
      expect(run).toStrictEqual([{ status: "rejected", reason: { _id: "1", error: "unknown" } }]);
    });
  });

  describe("incrementMySubStep", () => {
    it("should complete the user step when incrementMySubStep is called.", async() => {
      const spy = jest.spyOn(controller["welcomeService"], "incrementSubStep");
      await controller.incrementMySubStep(userReq, "1");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("incrementSubStep", () => {
    it("should complete the user step when incrementSubStep is called.", async() => {
      const spy = jest.spyOn(controller["welcomeService"], "incrementSubStep");
      await controller.incrementSubStep(user._id, "1");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});