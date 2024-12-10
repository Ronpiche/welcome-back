import { Global, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";
import { CognitoJwtVerifier } from "aws-jwt-verify";

type Verifier = CognitoJwtVerifierSingleUserPool<{
  userPoolId: string;
  tokenUse: "access";
  clientId: string | string[];
}>;

@Injectable()
@Global()
export class CognitoService {
  public readonly issuerUrl: string;

  private readonly verifier: Verifier;

  public constructor(private readonly configService: ConfigService) {
    this.issuerUrl = `https://cognito-idp.${this.configService.get("COGNITO_REGION")}.amazonaws.com/${this.configService.get("COGNITO_USER_POOL_ID")}`;
    try {
      this.verifier = CognitoJwtVerifier.create({
        userPoolId: this.configService.get("COGNITO_USER_POOL_ID"),
        tokenUse: "access",
        clientId: this.configService.get("COGNITO_CLIENT_ID"),
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async verifyIdToken(token: string): Promise<ReturnType<Verifier["verify"]>> {
    try {
      return await this.verifier.verify(token);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}