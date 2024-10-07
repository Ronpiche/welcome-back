import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class AnswerDto {
  @ApiProperty({ example: "2" })
  @IsString()
  @IsNotEmpty()
  public label: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  public isCorrect: boolean;
}