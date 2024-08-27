import { Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';

@Injectable()
@Global()
export class JwtCognito {
  private verifier: CognitoJwtVerifierSingleUserPool<{
    userPoolId: string;
    tokenUse: 'id' | 'access';
    clientId: string | string[];
  }>;
  constructor(private readonly configService: ConfigService) {}

  async verifyJwt(token: string): Promise<any> {
    this.initCognitoJwt();
    try {
      return await this.verifier.verify(token);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private initCognitoJwt() {
    try {
      this.verifier = CognitoJwtVerifier.create({
        userPoolId: this.configService.get('USER_POOL_ID'),
        tokenUse: 'access',
        clientId: this.configService.get('CLIENT_ID'),
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
