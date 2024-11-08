import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { QuestionType } from "@modules/feedback-question/types/question-type.enum";

export class CreateFeedbackQuestionDto {
  @ApiProperty({ example: "How are you ?" })
  @IsString()
  @IsNotEmpty()
  public label: string;

  @ApiProperty({ example: QuestionType.SHORTLIST, enum: QuestionType })
  @IsEnum(QuestionType)
  public type: QuestionType;

  @ApiProperty({ example: ["Fine", "Sick"] })
  @IsArray()
  @IsString({ each: true })
  public answers: string[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  public minNumberOfAnswers: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  public maxNumberOfAnswers: number;
}