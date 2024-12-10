import { CacheService } from "@modules/shared/cache/cache.service";
import { Logger, Module } from "@nestjs/common";
import { AuthorizationController } from "./authorization.controller";
import { AuthorizationService } from "./authorization.service";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, CacheService, Logger],
})
export class AuthorizationModule {}