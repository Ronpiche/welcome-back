import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AnswerDto {
  @ApiProperty({ example: "0" })
  @IsString()
  @IsNotEmpty()
  public label: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  public isCompleted: boolean;
}