import { PartialType } from "@nestjs/swagger";
import { CreateQuizDto } from "@modules/quiz/dto/create-quiz.dto";

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}