import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { QuestionDto } from "@modules/quiz/dto/question.dto";

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty({ isArray: true, type: QuestionDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  public questions: QuestionDto[];
}