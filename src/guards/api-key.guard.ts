import { timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  public constructor(private readonly configService: ConfigService) { }

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = (req.headers["X-API-KEY"] ?? req.headers["x-api-key"]) as string | undefined;
    if (!apiKey) {
      return false;
    }
    return this.isApiKeyValid(apiKey);
  }

  private isApiKeyValid(apiKey: string): boolean {
    const apiKeyFromConfig = this.configService.get<string>("CRON_API_KEY");
    const bufferedApiKey = Buffer.from(apiKey);
    const bufferedApiKeyFromConfig = Buffer.from(apiKeyFromConfig);
    const areBuffersSameSize = bufferedApiKey.length === bufferedApiKeyFromConfig.length;

    return areBuffersSameSize && timingSafeEqual(bufferedApiKey, bufferedApiKeyFromConfig);
  }
}