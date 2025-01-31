import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { FirestoreModule } from "@src/services/firestore/firestore.module";
import { APP_GUARD } from "@nestjs/core";
import { WelcomeModule } from "@modules/welcome/welcome.module";
import { StepModule } from "@modules/step/step.module";
import { AppController } from "@src/app.controller";
import { AppService } from "@src/app.service";
import { AgenciesModule } from "@modules/agencies/agencies.module";
import { MembersModule } from "@modules/members/members.module";
import { ClientModule } from "@modules/client/client.module";
import { CloudStorageModule } from "@modules/cloud-storage/cloud-storage.module";
import { QuizModule } from "@modules/quiz/quiz.module";
import { FeedbackModule } from "@modules/feedback/feedback.module";
import { FeedbackQuestionModule } from "@modules/feedback-question/feedback-question.module";
import { FeedbackAnswerModule } from "@modules/feedback-answer/feedback-answer.module";
import { PracticeModule } from "@modules/practice/practice.module";
import { AuthModule } from "@modules/auth/auth.module";
import { JwtGuard } from "@src/guards/jwt.guard";
import { RoleGuard } from "@src/guards/role.guard";
import { MailModule } from "@src/services/mail/mail.module";
import { GipModule } from "@src/services/gip/gip.module";
import { CognitoModule } from "@src/services/cognito/cognito.module";

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
    MailModule,
    FirestoreModule,
    GipModule,
    CognitoModule,
    WelcomeModule,
    FeedbackModule,
    FeedbackQuestionModule,
    FeedbackAnswerModule,
    AuthModule,
    StepModule,
    AgenciesModule,
    MembersModule,
    ClientModule,
    CloudStorageModule,
    PracticeModule,
    QuizModule,
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
    AppService,
  ],
})
export class AppModule { }