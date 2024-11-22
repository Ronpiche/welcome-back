import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class StepEmailDto {
  @ApiProperty({
    example: "New step available",
    description: "Subject of the email.",
  })
  @IsString()
  @IsNotEmpty()
  public subject: string;

  @ApiProperty({
    example: "Hello, you have unlocked a new step.",
    description: "Body of the email.",
  })
  @IsString()
  @IsNotEmpty()
  public body: string;
}