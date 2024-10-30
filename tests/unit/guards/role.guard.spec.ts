import { Test } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import type { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { RoleGuard } from "@src/guards/role.guard";
import { ROLE_KEY, Role } from "@src/decorators/role";

const role = Role.ADMIN;

describe("RoleGuard", () => {
  let guard: RoleGuard;
  let context: ExecutionContextHost;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        RoleGuard,
        ConfigService,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    context = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: undefined },
        }),
      }),
    } as unknown as ExecutionContextHost;
    guard = module.get<RoleGuard>(RoleGuard);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("canActivate", () => {
    it("should return true when no role required is set.", () => {
      const canActivate = guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it("should return false when role required is not in user role.", () => {
      jest.spyOn(guard["reflector"], "get").mockImplementation((key: string) => (key === ROLE_KEY ? [role] : undefined));
      const canActivate = guard.canActivate(context);
      expect(canActivate).toBe(false);
    });

    it("should return true when role required is in user role.", () => {
      jest.spyOn(context.switchToHttp(), "getRequest").mockReturnValue({ user: { role } });
      jest.spyOn(guard["reflector"], "get").mockImplementation((key: string) => (key === ROLE_KEY ? [role] : undefined));
      const canActivate = guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it("should return true when BYPASS_GUARD is set.", () => {
      jest.spyOn(guard["configService"], "get").mockImplementation((key: string) => (key === "BYPASS_GUARD" ? "true" : ""));
      const canActivate = guard.canActivate(context);
      expect(canActivate).toBe(true);
    });
  });
});