import { StepService } from "@modules/step/step.service";
import { Logger, Module } from "@nestjs/common";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { WelcomeController } from "@modules/welcome/welcome.controller";
import { FirestoreModule } from "@src/services/firestore/firestore.module";
import { MailService } from "@src/services/mail/mail.service";

@Module({
  imports: [FirestoreModule],
  controllers: [WelcomeController],
  providers: [
    Logger,
    WelcomeService,
    StepService,
    MailService,
  ],
})
export class WelcomeModule {}