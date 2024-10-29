import { Logger, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { WelcomeModule } from "@modules/welcome/welcome.module";
import { FirestoreModule } from "@src/services/firestore/firestore.module";
import { CronService } from "@src/services/crons/crons.service";
import { WelcomeService } from "@src/modules/welcome/welcome.service";
import { StepService } from "@src/modules/step/step.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WelcomeModule,
    FirestoreModule,
  ],
  providers: [
    Logger,
    WelcomeService,
    StepService,
    CronService,
  ],
})

export class CronModule { }