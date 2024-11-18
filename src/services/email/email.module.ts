import { Logger, Module } from "@nestjs/common";
import { EmailService } from "@src/services/email/email.service";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [
    EmailService,
    Logger,
    ConfigService,
  ],
  exports: [EmailService],
})
export class EmailModule {}