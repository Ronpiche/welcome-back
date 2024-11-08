import { FeedbackController } from "@modules/feedback/feedback.controller";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { Logger, Module } from "@nestjs/common";
import { FirestoreModule } from "@src/services/firestore/firestore.module";
import { FeedbackQuestionModule } from "@modules/feedback-question/feedback-question.module";

@Module({
  imports: [FirestoreModule, FeedbackQuestionModule],
  controllers: [FeedbackController],
  providers: [Logger, FeedbackService],
})

export class FeedbackModule { }