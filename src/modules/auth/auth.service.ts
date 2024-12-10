import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseClient, Issuer, TokenSet, generators } from "openid-client";

type AuthorizationUrl = {
  authorizationUrl: string;
  nonce: string;
  state: string;
};

@Injectable()
export class AuthService {
  private client: BaseClient = null;

  private readonly redirectUrl: string;

  public constructor(private readonly configService: ConfigService) {
    this.redirectUrl = `${this.configService.get("HUB_FRONT_URL")}/auth/callback`;
  }

  public async getAuthorizationUrl(): Promise<AuthorizationUrl> {
    const client = await this.getClient();
    const nonce = generators.nonce();
    const state = generators.state();

    const authorizationUrl = client.authorizationUrl({
      scope: "openid email",
      nonce,
      state,
    });

    return { authorizationUrl, nonce, state };
  }

  public async handleCallback(code: string, nonce: string, state: string): Promise<TokenSet> {
    const client = await this.getClient();
    try {
      return await client.callback(
        this.redirectUrl,
        { code, state },
        { response_type: "code", nonce, state },
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  public async refresh(token: string): Promise<TokenSet> {
    const client = await this.getClient();
    try {
      return await client.refresh(token);
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  private async getClient(): Promise<BaseClient> {
    if (this.client === null) {
      try {
        const cognitoIssuer = await Issuer.discover(`https://cognito-idp.${this.configService.get("COGNITO_REGION")}.amazonaws.com/${this.configService.get("COGNITO_USER_POOL_ID")}/.well-known/openid-configuration`);
        this.client = new cognitoIssuer.Client({
          client_id: this.configService.get("COGNITO_CLIENT_ID"),
          client_secret: this.configService.get("COGNITO_CLIENT_SECRET"),
          redirect_uris: [this.redirectUrl],
          response_types: ["code"],
        });
      } catch (err) {
        if (err instanceof Error) {
          throw new InternalServerErrorException(err.message);
        }
      }
    }
    return this.client;
  }
}