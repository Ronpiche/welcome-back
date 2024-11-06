import { StepService } from "@modules/step/step.service";
import { Logger, Module } from "@nestjs/common";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { WelcomeController } from "@modules/welcome/welcome.controller";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [WelcomeController],
  providers: [
    Logger,
    WelcomeService,
    StepService,
  ],
})
export class WelcomeModule {}