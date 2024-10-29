import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DecodedIdToken, Auth, CreateRequest, UserRecord } from "firebase-admin/auth";

@Injectable()
export class GipService {
  public constructor(
    private readonly auth: Auth,
    private readonly logger: Logger,
  ) {}

  public async verifyIdToken(token: string): Promise<DecodedIdToken> {
    return this.auth.verifyIdToken(token);
  }

  public async createUser(properties: CreateRequest): Promise<UserRecord> {
    try {
      return await this.auth.createUser(properties);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  public async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth.deleteUser(uid);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }
}