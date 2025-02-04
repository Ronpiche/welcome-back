import { Test } from "@nestjs/testing";
import { GipService } from "@src/services/gip/gip.service";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { JwtGuard } from "@src/guards/jwt.guard";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import type { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { CognitoService } from "@src/services/cognito/cognito.service";
import { IS_PUBLIC_METADATA_SYMBOL } from "@src/decorators/isPublic";
import { UnauthorizedException } from "@nestjs/common";
import type { DecodedIdToken } from "firebase-admin/auth";

const authorizationGip = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBsb2NhbGhvc3QiLCJpc3MiOiJnaXAifQ.9-Hb_aZdm2xA_CBqm4r_YczADyvKeSyQHRIQl8g8sgQ";
const tokenResultGip = { sub: "1", email: "john.doe@localhost", iss: "gip" };
const authorizationCognito = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBsb2NhbGhvc3QiLCJpc3MiOiJjb2duaXRvIn0.5YzAwPZPiiLowXoHaoIeC-qgRpyHMFRjMww7120aSp0";
const tokenResultCognito = { sub: "1", email: "john.doe@localhost", iss: "cognito" };
const authorizationUnknown = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBsb2NhbGhvc3QiLCJpc3MiOiJ1bmtub3duIn0.YNL0upufTr9LYOkcaEuriSM2MgJXeYzJxFAS1iWkUUw";

describe("JwtGuard", () => {
  let guard: JwtGuard;
  let context: ExecutionContextHost;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        JwtGuard,
        ConfigService,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue(undefined),
          },
        },
        {
          provide: GipService,
          useValue: {
            verifyIdToken: jest.fn().mockRejectedValue(new Error()),
            isPayloadFrom: jest.fn().mockImplementation((p: Record<string, unknown>) => p.iss === "gip"),
          },
        },
        {
          provide: CognitoService,
          useValue: {
            verifyIdToken: jest.fn().mockRejectedValue(new Error()),
            isPayloadFrom: jest.fn().mockImplementation((p: Record<string, unknown>) => p.iss === "cognito"),
          },
        },
      ],
    }).compile();

    context = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: undefined },
        }),
      }),
    } as unknown as ExecutionContextHost;
    guard = module.get<JwtGuard>(JwtGuard);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("canActivate", () => {
    it("should throw UnauthorizedException when token is missing.", async() => {
      const error: UnauthorizedException = await getError(async() => guard.canActivate(context));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(UnauthorizedException);
    });

    it("should return true when decorator public is set.", async() => {
      jest.spyOn(guard["reflector"], "get").mockImplementation((key: string) => key === IS_PUBLIC_METADATA_SYMBOL);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it("should return true when Gip token is valid.", async() => {
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ headers: { authorization: authorizationGip } });
      jest.spyOn(guard["gipService"], "verifyIdToken").mockResolvedValue(tokenResultGip as DecodedIdToken);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it("should return true when Cognito token is valid.", async() => {
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ headers: { authorization: authorizationCognito } });
      jest.spyOn(guard["cognitoService"], "verifyIdToken").mockResolvedValue(tokenResultCognito as unknown as ReturnType<typeof guard["cognitoService"]["verifyIdToken"]>);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it("should throw UnauthorizedException when token is invalid.", async() => {
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ headers: { authorization: "test" } });
      const error: UnauthorizedException = await getError(async() => guard.canActivate(context));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(UnauthorizedException);
    });

    it("should throw UnauthorizedException when token is valid but has unknown issuer.", async() => {
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ headers: { authorization: authorizationUnknown } });
      const error: UnauthorizedException = await getError(async() => guard.canActivate(context));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(UnauthorizedException);
    });

    it("should return true when BYPASS_GUARD is set.", async() => {
      jest.spyOn(guard["configService"], "get").mockImplementation((key: string) => (key === "BYPASS_GUARD" ? "true" : ""));
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });
  });
});