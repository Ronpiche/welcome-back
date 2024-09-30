import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { FirestoreModule } from "@src/services/firestore/firestore.module";
import { AuthorizationModule } from "@modules/authorization/authorization.module";
import { APP_GUARD } from "@nestjs/core";
import { MailerModule } from "@nestjs-modules/mailer";
import { AccessGuard } from "./middleware/AuthGuard";
import { WelcomeModule } from "@modules/welcome/welcome.module";
import { JwtCognito } from "./modules/cognito/jwtCognito.service";
import { AuthentificationModule } from "./modules/authentification/authentification.module";
import { ContentModule } from "./modules/content/content.module";
import { StepModule } from "@modules/step/step.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AgenciesModule } from "./modules/agencies/agencies.module";
import { MembersModule } from "./modules/members/members.module";
import { CloudStorageModule } from "./modules/cloud-storage/cloud-storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || undefined,
        port: Number(process.env.SMTP_PORT) || undefined,
        auth: process.env.SMTP_AUTH_USERNAME ? {
          user: process.env.SMTP_AUTH_USERNAME,
          pass: process.env.SMTP_AUTH_PASSWORD,
        } : undefined,
      },
      defaults: {
        from: process.env.MAIL_FROM || "noreply@localhost",
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async() => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "2h", algorithm: "HS256" },
      }),
    }),
    FirestoreModule,
    AuthorizationModule,
    WelcomeModule,
    AuthentificationModule,
    ContentModule,
    StepModule,
    AgenciesModule,
    MembersModule,
    CloudStorageModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    JwtCognito,
    AppService,
  ],
})
export class AppModule {}