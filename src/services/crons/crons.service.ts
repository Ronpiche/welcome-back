import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { WelcomeService } from "@src/modules/welcome/welcome.service";
  
@Injectable()
export class CronService {
  public constructor(
    private readonly logger: Logger,
    private readonly welcomeService: WelcomeService,
  ) { }
  
  // TODO variabiliser .conf
  
  /*
   *
   * @Cron(CronExpression.EVERY_30_SECONDS)
   *
   * // du lundi au vendredi à 8h30
   * @Cron('0 30 8 * * 1-5', {
   * name: 'notifications',
   * timeZone: 'Europe/Paris',
   *})
   */
  
  @Cron("0 30 8 * * 1-5", {
    name: "notifications",
    timeZone: "Europe/Paris",
  })
  public async handleCron(): Promise<void> {
    this.logger.log("[CronService] sending unlocked steps emails...");
    try {
      await this.welcomeService.run(new Date());
    } catch (error) {
      this.logger.error(error?.message);
    }
  }
}