import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import type { InternalServerErrorException } from "@nestjs/common";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { CognitoService } from "src/services/cognito/cognito.service";

jest.mock("aws-jwt-verify", (): unknown => ({ CognitoJwtVerifier: { create: () => ({ verify: jest.fn() }) } }));

const tokenPayload = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.rTCH8cLoGxAm_xw68z-zXVKi9ie6xJn9tnVWjd_9ftE";
const tokenResult = { sub: "1" } as Awaited<ReturnType<CognitoService["verifyIdToken"]>>;

describe("CognitoService", () => {
  let service: CognitoService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        CognitoService,
        ConfigService,
      ],
    }).compile();

    service = module.get<CognitoService>(CognitoService);
  });

  afterEach(() => {
    jest.resetAllMocks();
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