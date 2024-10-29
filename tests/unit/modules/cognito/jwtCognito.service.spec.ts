import { ConfigService } from "@nestjs/config";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { JwtCognito } from "@modules/cognito/jwtCognito.service";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { UnauthorizedException } from "@nestjs/common";

describe("jwtCognitoService", () => {
  let service: JwtCognito;
  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtCognito, ConfigService],
    }).compile();

    service = module.get<JwtCognito>(JwtCognito);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should verify a correct jwt token", async() => {
    const payload: any = {
      sub: "1234-4567",
    };
    // eslint-disable-next-line jest/prefer-spy-on
    CognitoJwtVerifier.create = jest.fn().mockReturnValue({
      verify: jest.fn().mockResolvedValue(payload),
    });
    const res = await service.verifyIdToken("jwt.token");
    expect(res).toBeDefined();
    expect(res.sub).toBe("1234-4567");
  });

  it("should throw an error, if the token is false", async() => {
    // eslint-disable-next-line jest/prefer-spy-on
    CognitoJwtVerifier.create = jest.fn().mockReturnValue({
      verify: jest.fn().mockRejectedValue(new Error("error")),
    });
    try {
      await service.verifyIdToken("jwt.token");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.status).toBe(401);
    }
  });
});