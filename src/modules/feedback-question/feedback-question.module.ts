import { FeedbackQuestionController } from "@modules/feedback-question/feedback-question.controller";
import { FeedbackQuestionService } from "@modules/feedback-question/feedback-question.service";
import { Logger, Module } from "@nestjs/common";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [FeedbackQuestionController],
  providers: [Logger, FeedbackQuestionService],
  exports: [FeedbackQuestionService],
})

export class FeedbackQuestionModule { }