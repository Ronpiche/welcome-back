import { JwtCognito } from "@modules/cognito/jwtCognito.service";
import { CacheService } from "@modules/shared/cache/cache.service";
import { StepService } from "@modules/step/step.service";
import { Logger, Module } from "@nestjs/common";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { WelcomeController } from "@modules/welcome/welcome.controller";
import { APP_FILTER } from "@nestjs/core";
import { CreateUserExceptionFilter } from "@modules/welcome/filters/create-user.filter";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [WelcomeController],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: CreateUserExceptionFilter,
    },
    WelcomeService,
    StepService,
    CacheService,
    JwtCognito,
  ],
})
export class WelcomeModule {}