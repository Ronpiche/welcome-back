import { Logger, Module } from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import { WelcomeController } from './welcome.controller';
import { APP_FILTER } from '@nestjs/core';
import { CreateUserExceptionFilter } from './filters/create-user-filter';
import { FirestoreModule } from '../shared/firestore/firestore.module';
import { MicrosoftService } from '../microsoft/microsoft.service';
import { CacheService } from '../shared/cache/cache.service';

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
    MicrosoftService,
    CacheService,
  ],
})
export class WelcomeModule {}
