import { Logger, Module } from "@nestjs/common";
import { MailService } from "@src/services/mail/mail.service";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [
    MailService,
    Logger,
    ConfigService,
  ],
  exports: [MailService],
})
export class MailModule {}