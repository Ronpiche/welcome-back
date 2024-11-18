import { Logger, Module } from "@nestjs/common";
import { EmailService } from "@src/services/email/email.service";

@Module({
  providers: [
    EmailService,
    Logger,
  ],
  exports: [EmailService],
})
export class EmailModule {}