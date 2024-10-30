import { InternalServerErrorException, Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Auth } from "firebase-admin/auth";
import { GipService } from "@src/services/gip/gip.service";
import { NoErrorThrownError, getError } from "@tests/unit/utils";

const tokenPayload = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.rTCH8cLoGxAm_xw68z-zXVKi9ie6xJn9tnVWjd_9ftE";
const createUserPayload = {
  email: "test@test.fr",
  password: "Azerty@123",
};
const userResult = { uid: "1" };
const tokenResult = { sub: "1" };

describe("GipService", () => {
  let service: GipService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        GipService,
        {
          provide: Auth,
          useValue: {
            verifyIdToken: jest.fn().mockResolvedValue(tokenResult),
            createUser: jest.fn().mockResolvedValue(userResult),
            deleteUser: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GipService>(GipService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("verifyIdToken", () => {
    it("should return decoded token when verifyIdToken success.", async() => {
      const verifyIdToken = await service.verifyIdToken(tokenPayload);
      expect(verifyIdToken).toStrictEqual(tokenResult);
    });

    it("should throw when verifyIdToken fails.", async() => {
      jest.spyOn(service["auth"], "verifyIdToken").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.verifyIdToken(tokenPayload));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("createUser", () => {
    it("should return user when createUser.", async() => {
      const createUser = await service.createUser(createUserPayload);
      expect(createUser).toStrictEqual(userResult);
    });

    it("should throw when createUser fails.", async() => {
      jest.spyOn(service["auth"], "createUser").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.createUser(createUserPayload));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("deleteUser", () => {
    it("should return void when deleteUser.", async() => {
      const spy = jest.spyOn(service["auth"], "deleteUser");
      await service.deleteUser(userResult.uid);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(userResult.uid);
    });

    it("should throw when deleteUser fails.", async() => {
      jest.spyOn(service["auth"], "deleteUser").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.deleteUser(userResult.uid));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});