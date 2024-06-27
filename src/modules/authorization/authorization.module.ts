import { Logger, Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { FirestoreModule } from '../shared/firestore/firestore.module';
import { CacheService } from '../shared/cache/cache.service';
import { JwtCognito } from '../cognito/jwtCognito.service';

@Module({
  imports: [FirestoreModule],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, CacheService, Logger, JwtCognito],
})
export class AuthorizationModule {}
