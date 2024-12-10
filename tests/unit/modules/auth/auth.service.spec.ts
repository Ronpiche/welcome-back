import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AuthService } from "@modules/auth/auth.service";
import { ConfigService } from "@nestjs/config";
import type { TokenSet } from "openid-client";
import { BadRequestException } from "@nestjs/common";
import { NoErrorThrownError, getError } from "@tests/unit/utils";

const AUTHORIZATION_URL = "localhost";
const NONCE = "nonce";
const STATE = "state";
const TOKEN_SET: TokenSet = { expired: () => false, claims: () => ({ aud: "", exp: 0, iat: 0, iss: "test", sub: "" }) };

class OpenIdClientMock {
  private readonly _authorizationUrl = AUTHORIZATION_URL;

  private readonly _tokenSet = TOKEN_SET;

  public authorizationUrl(): string {
    return this._authorizationUrl;
  }

  public async callback(): Promise<TokenSet> {
    return Promise.resolve(this._tokenSet);
  }

  public async refresh(): Promise<TokenSet> {
    return Promise.resolve(this._tokenSet);
  }
}

jest.mock("openid-client", (): unknown => ({
  Issuer: {
    discover: () => ({
      Client: OpenIdClientMock,
    }),
  },
  generators: {
    nonce: () => NONCE,
    state: () => STATE,
  },
}));

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getAuthorizationUrl", () => {
    it("should return authorization url object when getAuthorizationUrl is called.", async() => {
      const getAuthorizationUrl = await service.getAuthorizationUrl();
      expect(getAuthorizationUrl).toStrictEqual({ authorizationUrl: AUTHORIZATION_URL, nonce: NONCE, state: STATE });
    });
  });

  describe("handleCallback", () => {
    it("should return TokenSet object when handleCallback is called with correct params.", async() => {
      const handleCallback = await service.handleCallback("", "", "");
      expect(handleCallback).toStrictEqual(TOKEN_SET);
    });

    it("should throw when handleCallback fails.", async() => {
      jest.spyOn(OpenIdClientMock.prototype, "callback").mockRejectedValue(new Error());
      const error: BadRequestException = await getError(async() => service.handleCallback("", "", ""));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(BadRequestException);
    });
  });

  describe("refresh", () => {
    it("should return TokenSet object when refresh is called with correct token.", async() => {
      const refresh = await service.refresh("");
      expect(refresh).toStrictEqual(TOKEN_SET);
    });

    it("should throw when refresh fails.", async() => {
      jest.spyOn(OpenIdClientMock.prototype, "refresh").mockRejectedValue(new Error());
      const error: BadRequestException = await getError(async() => service.refresh(""));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(BadRequestException);
    });
  });
});