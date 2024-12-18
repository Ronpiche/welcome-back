import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";
import { StepEmail } from "@modules/step/entities/step-email.entity";
import { CreateUserDto } from "@modules/welcome/dto/input/create-user.dto";
import { WelcomeUser } from "@modules/welcome/entities/user.entity";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MAIL_FROM, MAIL_FROM_NAME } from "@src/services/mail/mail.constants";
import { MailRequirement } from "@src/services/mail/mail.types";

@Injectable()
export class MailService {
  private readonly brevoMailingInstance = new TransactionalEmailsApi();

  public constructor(
    private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {
    const brevoApiKey = this.config.get<string>("BREVO_API_KEY");
    this.brevoMailingInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, brevoApiKey);
  }

  public async sendStepMail(user: WelcomeUser, stepUnlockEmail: StepEmail, stepId: string): Promise<void> {
    /**
     * TODO: The following lines are temporary. Implement the logic to send an email to the user when a step is unlocked in PR https://github.com/we-are-daveo/welcome-hub-back/pull/75
     */
    void user;
    void stepUnlockEmail;
    void stepId;
    const dummyMailRequirement: MailRequirement = {
      to: "john@doe.com",
      subject: "Welcome to the next step",
      html: "<p>Hey John, you've unlocked the next step!</p>",
    };

    return this.sendMail(dummyMailRequirement);
  }

  public async inviteNewUserMail(createUserDto: CreateUserDto, password: string): Promise<void> {
    /**
     * TODO: The following lines are temporary. Implement the logic to send an email to the user when a step is unlocked in PR https://github.com/we-are-daveo/welcome-hub-back/pull/75
     */
    void createUserDto;
    void password;
    const dummyMailRequirement: MailRequirement = {
      to: "john@doe.com",
      subject: "Welcome to the platform",
      html: "<p>Hey John, welcome to the platform!</p>",
    };

    return this.sendMail(dummyMailRequirement);
  }

  private async sendMail(mailRequirement: MailRequirement): Promise<void> {
    try {
      const mail = this.getSmtpMailFromRequirement(mailRequirement);
      await this.brevoMailingInstance.sendTransacEmail(mail);
      this.logger.log(`Email successfully dispatched to ${mailRequirement.to}`);
    } catch (error) {
      this.logger.error("Error while sending email", error);
      throw error;
    }
  }

  private getSmtpMailFromRequirement(mailRequirement: MailRequirement): SendSmtpEmail {
    const mail = new SendSmtpEmail();
    mail.to = [{ email: mailRequirement.to }];
    mail.sender = {
      name: MAIL_FROM_NAME,
      email: MAIL_FROM,
    };
    mail.subject = mailRequirement.subject;
    mail.htmlContent = mailRequirement.html;

    return mail;
  }
}