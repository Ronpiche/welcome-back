import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AnswerDto {
  @ApiProperty({ example: "2" })
  @IsString()
  @IsNotEmpty()
  public label: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public iconPath?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  public isCorrect: boolean;
}