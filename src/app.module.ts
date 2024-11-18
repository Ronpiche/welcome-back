import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { FirestoreModule } from "@src/services/firestore/firestore.module";
import { AuthorizationModule } from "@modules/authorization/authorization.module";
import { APP_GUARD } from "@nestjs/core";
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
import { FeedbackModule } from "@modules/feedback/feedback.module";
import { FeedbackQuestionModule } from "@modules/feedback-question/feedback-question.module";
import { FeedbackAnswerModule } from "@modules/feedback-answer/feedback-answer.module";
import { JwtGuard } from "@src/guards/jwt.guard";
import { RoleGuard } from "@src/guards/role.guard";
import { EmailModule } from "@src/services/email/email.module";
import { GipModule } from "@src/services/gip/gip.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "2h", algorithm: "HS256" },
      }),
    }),
    EmailModule,
    FirestoreModule,
    AuthorizationModule,
    WelcomeModule,
    ContentModule,
    FeedbackModule,
    FeedbackQuestionModule,
    FeedbackAnswerModule,
    StepModule,
    AgenciesModule,
    MembersModule,
    CloudStorageModule,
    QuizModule,
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