import { Global, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";

type Verifier = CognitoJwtVerifierSingleUserPool<{
  userPoolId: string;
  tokenUse: "id" | "access";
  clientId: string | string[];
}>;

@Injectable()
@Global()
export class JwtCognito {
  private verifier: Verifier;

  public constructor(private readonly configService: ConfigService) { }

  public async verifyIdToken(token: string): Promise<ReturnType<Verifier["verify"]>> {
    this.initCognitoJwt();
    try {
      return await this.verifier.verify(token);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private initCognitoJwt(): void {
    try {
      this.verifier = CognitoJwtVerifier.create({
        userPoolId: this.configService.get("USER_POOL_ID"),
        tokenUse: "access",
        clientId: this.configService.get("CLIENT_ID"),
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}