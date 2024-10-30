import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRequest } from "@src/guards/jwt.guard";
import { ROLE_KEY, Role } from "@src/decorators/role";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RoleGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) { }

  private static haveRoles(requiredRoles: Role[], userRole: Role): boolean {
    return requiredRoles.some(role => role === userRole);
  }

  public canActivate(context: ExecutionContext): boolean {
    if (this.configService.get("BYPASS_GUARD") === "true") {
      return true;
    }
    const requiredRoles = this.reflector.get<Role[]>(ROLE_KEY, context.getHandler());
    if (requiredRoles === undefined) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<UserRequest>();

    return RoleGuard.haveRoles(requiredRoles, user.role);
  }
}