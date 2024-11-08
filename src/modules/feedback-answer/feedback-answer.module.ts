import { FeedbackAnswerController } from "@modules/feedback-answer/feedback-answer.controller";
import { FeedbackAnswerService } from "@modules/feedback-answer/feedback-answer.service";
import { Logger, Module } from "@nestjs/common";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [FeedbackAnswerController],
  providers: [Logger, FeedbackAnswerService],
})

export class FeedbackAnswerModule { }