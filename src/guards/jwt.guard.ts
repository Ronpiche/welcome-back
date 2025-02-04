import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { GipService } from "@src/services/gip/gip.service";
import { CognitoService } from "@src/services/cognito/cognito.service";
import { Role } from "@src/decorators/role";
import { IS_PUBLIC_METADATA_SYMBOL } from "@src/decorators/isPublic";

export type UserRequest = {
  user: {
    id: string;
    email: string;
    role: Role;
  };
};

@Injectable()
export class JwtGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly gipService: GipService,
    private readonly cognitoService: CognitoService,
    private readonly configService: ConfigService,
  ) { }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const { authorization } = request.headers;
    if (!authorization) {
      return;
    }
    const [type, token] = authorization.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_METADATA_SYMBOL, context.getHandler());
    const request = context.switchToHttp().getRequest<Request & UserRequest>();
    if (isPublic) {
      return true;
    }
    if (this.configService.get("BYPASS_GUARD") === "true") {
      request.user = {
        id: "bypass",
        email: "bypass@localhost",
        role: Role.ADMIN,
      };

      return true;
    }
    const token = JwtGuard.extractTokenFromHeader(request);
    Object.assign(request, await this.verifyToken(token));

    return true;
  }

  private async verifyToken(token: string): Promise<UserRequest> {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const [, payloadStr] = token.split(".");
      const payload = JSON.parse(globalThis.atob(payloadStr)) as Record<string, unknown>;
      if (this.gipService.isPayloadFrom(payload)) {
        return await this.verifyGipToken(token);
      }
      if (this.cognitoService.isPayloadFrom(payload)) {
        return await this.verifyCognitoToken(token);
      }
      throw new Error();
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async verifyGipToken(token: string): Promise<UserRequest> {
    const payload = await this.gipService.verifyIdToken(token);

    return {
      user: {
        id: payload.sub,
        email: payload.email,
        role: Role.USER,
      },
    };
  }

  private async verifyCognitoToken(token: string): Promise<UserRequest> {
    const payload = await this.cognitoService.verifyIdToken(token);

    return {
      user: {
        id: payload.sub,
        email: "username" in payload && typeof payload.username === "string" ? payload.username.replace("azuread_", "") : undefined,
        role: Role.ADMIN,
      },
    };
  }
}