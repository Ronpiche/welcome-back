import type { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { ApiKeyGuard } from "@src/guards/api-key.guard";

describe("Api Key Guard", () => {
  let guards: { apiKey: ApiKeyGuard };
  let mocks: {
    guards: {
      apiKey: {
        isApiKeyValid: jest.SpyInstance;
      };
    };
    services: {
      config: {
        get: jest.Mock;
      };
    };
  };

  beforeEach(async() => {
    mocks = {
      guards: {
        apiKey: {
          isApiKeyValid: jest.fn(),
        },
      },
      services: {
        config: {
          get: jest.fn().mockReturnValue("api-key"),
        },
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mocks.services.config,
        },
        ApiKeyGuard,
      ],
    }).compile();

    guards = { apiKey: module.get<ApiKeyGuard>(ApiKeyGuard) };
  });

  describe("canActivate", () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            "X-API-KEY": "api-key",
          },
        }),
      }),
    } as unknown as ExecutionContext;
    beforeEach(() => {
      mocks.guards.apiKey.isApiKeyValid = jest.spyOn(guards.apiKey as unknown as { isApiKeyValid }, "isApiKeyValid").mockReturnValue(false);
    });

    it("should return false when api key is undefined.", () => {
      const localContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              "X-API-KEY": undefined,
            },
          }),
        }),
      } as unknown as ExecutionContext;

      expect(guards.apiKey.canActivate(localContext)).toBe(false);
    });

    it("should return false when api key is invalid.", () => {
      mocks.guards.apiKey.isApiKeyValid.mockReturnValue(false);

      expect(guards.apiKey.canActivate(context)).toBe(false);
    });

    it("should return true when api key is valid.", () => {
      mocks.guards.apiKey.isApiKeyValid.mockReturnValue(true);

      expect(guards.apiKey.canActivate(context)).toBe(true);
    });

    it("should call isApiKeyValid with the api key from the request when called.", () => {
      guards.apiKey.canActivate(context);

      expect(mocks.guards.apiKey.isApiKeyValid).toHaveBeenCalledTimes(1);
      expect(mocks.guards.apiKey.isApiKeyValid).toHaveBeenCalledWith("api-key");
    });
  });

  describe("isApiKeyValid", () => {
    it("should return false when api key is invalid.", () => {
      const apiKey = "invalid-api-key";

      expect(guards.apiKey["isApiKeyValid"](apiKey)).toBe(false);
    });

    it("should return true when api key is valid.", () => {
      const apiKey = "api-key";

      expect(guards.apiKey["isApiKeyValid"](apiKey)).toBe(true);
    });
  });
});