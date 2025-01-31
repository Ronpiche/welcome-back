import { Controller, Get } from "@nestjs/common";
import { AppService } from "@src/app.service";
import { IsPublic } from "@src/decorators/isPublic";

@Controller("health")
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic(true)
  public getHealth(): string {
    return this.appService.getHealth();
  }
}