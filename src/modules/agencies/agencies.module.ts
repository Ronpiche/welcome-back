import { Module } from "@nestjs/common";
import { AgenciesService } from "@modules/agencies/agencies.service";
import { AgenciesController } from "@modules/agencies/agencies.controller";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  controllers: [AgenciesController],
  providers: [AgenciesService],
  imports: [FirestoreModule],
})
export class AgenciesModule {}