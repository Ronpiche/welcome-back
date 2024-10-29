import { SetMetadata } from "@nestjs/common";
import type { CustomDecorator } from "@nestjs/common";

export const ROLE_KEY = "roles";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export const Roles = (...args: Role[]): CustomDecorator => SetMetadata(ROLE_KEY, args);