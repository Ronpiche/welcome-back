import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { SafeQuestionDto } from "@modules/quiz/dto/safe-question.dto";

export class OutputSafeQuizDto {
  @ApiProperty()
  @Expose()
  public _id: string;

  @ApiProperty({ isArray: true, type: SafeQuestionDto })
  @Expose()
  @Type(() => SafeQuestionDto)
  public questions: SafeQuestionDto[];
}