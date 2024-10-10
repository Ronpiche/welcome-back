import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { AnswerDto } from "@modules/quiz/dto/answer.dto";

export class QuestionDto {
  @ApiProperty({ example: "How many are 1 + 1 ?" })
  @IsString()
  @IsNotEmpty()
  public label: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public hint?: string;

  @ApiProperty({ isArray: true, type: AnswerDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  public answers: AnswerDto[];
}