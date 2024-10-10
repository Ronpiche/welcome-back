import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { SafeAnswerDto } from "@modules/quiz/dto/safe-answer.dto";

export class SafeQuestionDto {
  @ApiProperty()
  @Expose()
  public label: string;

  @ApiProperty()
  @Expose()
  public hint?: string;

  @ApiProperty({ isArray: true, type: SafeAnswerDto })
  @Expose()
  @Type(() => SafeAnswerDto)
  public answers: SafeAnswerDto[];

  @ApiProperty()
  @Expose()
  public numberOfCorrectAnswers: number;
}