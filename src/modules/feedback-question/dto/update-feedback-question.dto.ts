import { PartialType } from "@nestjs/swagger";
import { CreateFeedbackQuestionDto } from "@modules/feedback-question/dto/create-feedback-question.dto";

export class UpdateFeedbackQuestionDto extends PartialType(CreateFeedbackQuestionDto) {}