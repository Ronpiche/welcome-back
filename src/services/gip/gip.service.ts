import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DecodedIdToken, Auth, CreateRequest, UserRecord } from "firebase-admin/auth";

@Injectable()
export class GipService {
  public readonly issuerUrl: string;

  public constructor(
    private readonly auth: Auth,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.issuerUrl = `https://securetoken.google.com/${this.configService.get("PROJECT_ID")}`;
  }

  public async verifyIdToken(token: string): Promise<DecodedIdToken> {
    return this.auth.verifyIdToken(token);
  }

  public async createUser(properties: CreateRequest): Promise<UserRecord> {
    try {
      return await this.auth.createUser(properties);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      throw new InternalServerErrorException();
    }
  }

  public async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth.deleteUser(uid);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      throw new InternalServerErrorException();
    }
  }
}