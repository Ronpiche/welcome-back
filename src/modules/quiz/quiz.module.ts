import { JwtCognito } from "@modules/cognito/jwtCognito.service";
import { QuizController } from "@modules/quiz/quiz.controller";
import { QuizService } from "@modules/quiz/quiz.service";
import { Logger, Module } from "@nestjs/common";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [QuizController],
  providers: [Logger, QuizService, JwtCognito],
})
export class StepModule {}