import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { FirestoreModule } from "@src/services/firestore/firestore.module";
import { AuthorizationModule } from "@modules/authorization/authorization.module";
import { APP_GUARD } from "@nestjs/core";
import { MailerModule } from "@nestjs-modules/mailer";
import { WelcomeModule } from "@modules/welcome/welcome.module";
import { JwtCognito } from "@modules/cognito/jwtCognito.service";
import { ContentModule } from "@modules/content/content.module";
import { StepModule } from "@modules/step/step.module";
import { AppController } from "@src/app.controller";
import { AppService } from "@src/app.service";
import { AgenciesModule } from "@modules/agencies/agencies.module";
import { MembersModule } from "@modules/members/members.module";
import { CloudStorageModule } from "@modules/cloud-storage/cloud-storage.module";
import { QuizModule } from "@modules/quiz/quiz.module";
import { CronModule } from "@src/services/crons/crons.module";
import { JwtGuard } from "@src/guards/jwt.guard";
import { RoleGuard } from "@src/guards/role.guard";
import { GipModule } from "@src/services/gip/gip.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || undefined,
        auth: process.env.SMTP_AUTH_USERNAME ? {
          user: process.env.SMTP_AUTH_USERNAME,
          pass: process.env.SMTP_AUTH_PASSWORD,
        } : undefined,
      } : {
        jsonTransport: true,
      },
      defaults: {
        from: process.env.MAIL_FROM || "noreply@localhost",
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "2h", algorithm: "HS256" },
      }),
    }),
    FirestoreModule,
    AuthorizationModule,
    WelcomeModule,
    ContentModule,
    StepModule,
    AgenciesModule,
    MembersModule,
    CloudStorageModule,
    QuizModule,
    CronModule,
    GipModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    JwtCognito,
    AppService,
  ],
})
export class AppModule { }