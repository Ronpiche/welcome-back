import { ApiProperty } from "@nestjs/swagger";

export class StepEmail {
  @ApiProperty({
    example: "New step available",
    description: "Subject of the email.",
  })
  public subject: string;

  @ApiProperty({
    example: "Hello, you have unlocked a new step.",
    description: "Body of the email.",
  })
  public body: string;
}