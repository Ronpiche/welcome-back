import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import type { InternalServerErrorException } from "@nestjs/common";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { CognitoService } from "src/services/cognito/cognito.service";

jest.mock("aws-jwt-verify", (): unknown => ({ CognitoJwtVerifier: { create: () => ({ verify: jest.fn() }) } }));

const tokenPayload = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC50ZXN0LmFtYXpvbmF3cy5jb20vdGVzdCJ9.nWwdUEX1IhGv-t6zEFMAcW2ybKVKKRNqDSloODmnR9A";
const tokenResult = { sub: "1" } as Awaited<ReturnType<CognitoService["verifyIdToken"]>>;

describe("CognitoService", () => {
  let service: CognitoService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        CognitoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(() => "test"),
          },
        },
      ],
    }).compile();

    service = module.get<CognitoService>(CognitoService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("isPayloadFrom", () => {
    it("should return true when token is from Cognito.", () => {
      const [, payloadStr] = tokenPayload.split(".");
      const payload = JSON.parse(globalThis.atob(payloadStr)) as Record<string, unknown>;
      const isTokenFrom = service.isPayloadFrom(payload);
      expect(isTokenFrom).toBe(true);
    });

    it("should return false when token is not from Cognito.", () => {
      const [, payloadStr] = tokenPayload.split(".");
      const payload = JSON.parse(globalThis.atob(payloadStr)) as Record<string, unknown>;
      payload.iss = "http://localhost";
      const isTokenFrom = service.isPayloadFrom(payload);
      expect(isTokenFrom).toBe(false);
    });
  });

  describe("verifyIdToken", () => {
    it("should return decoded token when verifyIdToken success.", async() => {
      jest.spyOn(service["verifier"], "verify").mockResolvedValue(tokenResult);
      const verifyIdToken = await service.verifyIdToken(tokenPayload);
      expect(verifyIdToken).toStrictEqual(tokenResult);
    });

    it("should throw when verifyIdToken fails.", async() => {
      jest.spyOn(service["verifier"], "verify").mockRejectedValue(new Error());
      const error: InternalServerErrorException = await getError(async() => service.verifyIdToken(tokenPayload));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(UnauthorizedException);
    });
  });
});