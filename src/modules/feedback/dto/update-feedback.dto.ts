import { PartialType } from "@nestjs/swagger";
import { CreateFeedbackDto } from "@modules/feedback/dto/create-feedback.dto";

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}