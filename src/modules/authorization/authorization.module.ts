import { Logger, Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { FirestoreModule } from '../shared/firestore/firestore.module';
import { MicrosoftService } from '../microsoft/microsoft.service';
import { CacheService } from '../shared/cache/cache.service';

@Module({
  imports: [FirestoreModule],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, MicrosoftService, CacheService, Logger],
})
export class AuthorizationModule {}
