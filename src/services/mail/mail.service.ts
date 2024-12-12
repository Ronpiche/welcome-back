import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { MailDataRequired, default as SendGrid } from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";
import { MAIL_FROM } from "@src/services/mail/mail.constants";
import { StepEmail } from "@src/modules/step/entities/step-email.entity";
import { CreateUserDto } from "@src/modules/welcome/dto/input/create-user.dto";
import { WelcomeUser } from "@src/modules/welcome/entities/user.entity";
import markdownit, { StateCore } from "markdown-it";

const APP_NAME = "Welcome";
const NEW_ACCOUNT_EMAIL_SUBJECT = "Compte créé";
const NEW_ACCOUNT_EMAIL_BODY = "Bonjour {{userFirstName}},\n\nTu peux désormais accéder à l'application [{{appName}}]({{appUrl}}) (sur desktop, tablette ou mobile)" +
  " en te connectant avec ces identifiants :\n\n\n\n*Email :* {{email}}\n\n*Mot de passe :* {{password}}\n\n\n\nÀ très bientôt,\n\n{{managerFirstName}} {{managerLastName}}.";

@Injectable()
export class MailService {
  private readonly md = markdownit();

  public constructor(
    private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {
    SendGrid.setApiKey(config.get("SENDGRID_API_KEY"));
    this.md.core.ruler.after("normalize", "variables", MailService.markdownVariable);
  }

  private static markdownVariable(state: StateCore): void {
    state.src = state.src.replaceAll(/{{\s?(\w+)\s?}}/g, (_, name: string) => state.env[name] || "".padStart(name.length, "█"));
  }

  public async inviteNewUserMail(createUserDto: CreateUserDto, password: string): Promise<void> {
    const mailbody = this.md.render(NEW_ACCOUNT_EMAIL_BODY, {
      appName: APP_NAME,
      appUrl: this.config.get<string>("HUB_FRONT_URL"),
      userFirstName: createUserDto.firstName,
      userLastName: createUserDto.lastName,
      email: createUserDto.email,
      password,
    });

    await this.sendMail({
      to: createUserDto.email,
      subject: NEW_ACCOUNT_EMAIL_SUBJECT,
      html: mailbody,
    });
  }

  public async sendStepMail(user: WelcomeUser, stepEmail: StepEmail, stepId: string): Promise<void> {
    const env = {
      appName: this.config.get<string>("APP_NAME"),
      appUrl: this.config.get<string>("HUB_FRONT_URL"),
      userFirstName: user.firstName,
      userLastName: user.lastName,
      managerFirstName: user.hrReferent.firstName,
      managerLastName: user.hrReferent.lastName,
      stepId,
    };

    await this.sendMail({
      to: user.email,
      subject: stepEmail.subject,
      html: this.md.render(stepEmail.body, env),
    });
  }

  private async sendMail(mailRequirement: { to: string; subject: string; html: string }): Promise<void> {
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
      this.logger.error("Error while sending email", error);
      throw error;
    }
  }
}