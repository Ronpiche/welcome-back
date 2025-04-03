import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { StepEmail } from "@modules/step/entities/step-email.entity";
import { CreateUserDto } from "@modules/welcome/dto/input/create-user.dto";
import { WelcomeUser } from "@modules/welcome/entities/user.entity";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MAIL_APP_NAME, MAIL_FROM, MAIL_FROM_NAME } from "@src/services/mail/mail.constants";
import { CommonMailData, InviteNewUserMailData, MailRequirement, MailTemplateName, StepMailData } from "@src/services/mail/mail.types";
import { renderFile } from "ejs";
import path from "path";

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

  public async sendStepMail(user: WelcomeUser, stepEmail: StepEmail, stepId: string): Promise<void> {
    const data: StepMailData = {
      ...this.getCommonMailData(user),
      stepId,
    };
    const templateName = `step-${stepId}` as MailTemplateName;
    const templatePath = this.getMailTemplatePath(templateName);

    await this.sendMail({
      to: user.email,
      subject: stepEmail.subject,
      html: await renderFile(templatePath, data),
    });
  }

  public async sendStepMailToManager(user: WelcomeUser, stepEmail: StepEmail, stepId: string): Promise<void> {
    const data: StepMailData = {
      ...this.getCommonMailData(user),
      stepId,
    };

    const templateName = `notify-manager` as MailTemplateName;
    const templatePath = this.getMailTemplatePath(templateName);

    await this.sendMail({
      to: user.hrReferent.email,
      subject: stepEmail.subject,
      html: await renderFile(templatePath, data),
    });
  }

  public async inviteNewUserMail(createUserDto: CreateUserDto, password: string): Promise<void> {
    const data: InviteNewUserMailData = {
      ...this.getCommonMailData(createUserDto),
      email: createUserDto.email,
      password,
    };
    const templatePath = this.getMailTemplatePath("new-user");

    await this.sendMail({
      to: createUserDto.email,
      subject: "Sujet [Welcome] Tes identifiants de connexion",
      html: await renderFile(templatePath, data),
    });
  }

  private getMailTemplatePath(templateName: MailTemplateName): string {
    return path.join(__dirname, "/templates/", `${templateName}.mail-template.ejs`);
  }

  private getCommonMailData(user: WelcomeUser | CreateUserDto): CommonMailData {
    return {
      appName: MAIL_APP_NAME,
      appUrl: this.config.get<string>("FRONT_BASE_URL"),
      userFirstName: user.firstName,
      userLastName: user.lastName,
      managerFirstName: user.hrReferent.firstName,
      managerLastName: user.hrReferent.lastName,
    };
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