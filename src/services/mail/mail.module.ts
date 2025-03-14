import { Logger, Module } from "@nestjs/common";
import { MailService } from "@src/services/mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    MailService,
    Logger,
    ConfigService,
  ],
  exports: [MailService],
})
export class MailModule {}