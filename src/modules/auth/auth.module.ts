import { AuthController } from "@modules/auth/auth.controller";
import { AuthService } from "@modules/auth/auth.service";
import { Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [AuthController],
  providers: [ConfigService, Logger, AuthService],
})

export class AuthModule { }