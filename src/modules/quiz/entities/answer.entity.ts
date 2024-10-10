import { ApiProperty } from "@nestjs/swagger";

export class Answer {
  @ApiProperty()
  public label: string;

  @ApiProperty()
  public iconPath?: string;

  @ApiProperty()
  public isCorrect: boolean;
}