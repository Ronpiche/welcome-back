import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { MailDataRequired, default as SendGrid } from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";
import { MAIL_FROM } from "@src/services/mail/mail.constants";

@Injectable()
export class MailService {
  public constructor(
    private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {
    SendGrid.setApiKey(config.get("SENDGRID_API_KEY"));
  }
  
  public async sendMail(mailRequirement: { to: string; subject: string; html: string }): Promise<void> {
    try {
      const mail: MailDataRequired = {
        to: mailRequirement.to,
        subject: mailRequirement.subject,
        html: mailRequirement.html,
        from: MAIL_FROM,
      };

      await SendGrid.send(mail);
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
    } catch (error) {
      // you can do more with the error
      this.logger.error("Error while sending email", error);
      throw error;
    }
  }
}