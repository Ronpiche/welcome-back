import { StepController } from "@modules/step/step.controller";
import { StepService } from "@modules/step/step.service";
import { Logger, Module } from "@nestjs/common";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [StepController],
  providers: [Logger, StepService],
})
export class StepModule {}