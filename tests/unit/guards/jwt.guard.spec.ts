import { Test } from "@nestjs/testing";
import { GipService } from "@src/services/gip/gip.service";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { JwtGuard } from "@src/guards/jwt.guard";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import type { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { JwtCognito } from "@src/modules/cognito/jwtCognito.service";
import { IS_PUBLIC_METADATA_SYMBOL } from "@src/decorators/isPublic";
import { UnauthorizedException } from "@nestjs/common";
import type { DecodedIdToken } from "firebase-admin/auth";

const authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBsb2NhbGhvc3QifQ.0_El0Y1KZ2WaE7aYsXI3IxaaFaW_8v00BJTCFmJm9mc";
const tokenResult = { sub: "1", email: "john.doe@localhost" };

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
          },
        },
        {
          provide: JwtCognito,
          useValue: {
            verifyIdToken: jest.fn().mockRejectedValue(new Error()),
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
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ headers: { authorization } });
      jest.spyOn(guard["gipService"], "verifyIdToken").mockResolvedValue(tokenResult as DecodedIdToken);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it("should return true when Cognito token is valid.", async() => {
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ headers: { authorization } });
      jest.spyOn(guard["jwtCognito"], "verifyIdToken").mockResolvedValue(tokenResult as unknown as ReturnType<typeof guard["jwtCognito"]["verifyIdToken"]>);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it("should throw UnauthorizedException when token is invalid.", async() => {
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ headers: { authorization } });
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