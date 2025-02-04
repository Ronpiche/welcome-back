import { InternalServerErrorException, Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { Auth } from "firebase-admin/auth";
import { GipService } from "@src/services/gip/gip.service";
import { NoErrorThrownError, getError } from "@tests/unit/utils";

const tokenPayload = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tLzEyMzQifQ.3aldB7TfJrKvHbyVNhJzzRyvKl_9M2_sb5EAHy1HFMs";
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
        ConfigService,
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

  describe("isPayloadFrom", () => {
    it("should return true when token is from GIP.", () => {
      const [, payloadStr] = tokenPayload.split(".");
      const payload = JSON.parse(globalThis.atob(payloadStr)) as Record<string, unknown>;
      const isTokenFrom = service.isPayloadFrom(payload);
      expect(isTokenFrom).toBe(true);
    });

    it("should return false when token is not from GIP.", () => {
      const [, payloadStr] = tokenPayload.split(".");
      const payload = JSON.parse(globalThis.atob(payloadStr)) as Record<string, unknown>;
      payload.iss = "http://localhost";
      const isTokenFrom = service.isPayloadFrom(payload);
      expect(isTokenFrom).toBe(false);
    });
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