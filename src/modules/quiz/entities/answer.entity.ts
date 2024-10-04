import { ApiProperty } from "@nestjs/swagger";

export class Answer {
  @ApiProperty()
  public label: string;

  @ApiProperty()
  public isTrue: boolean;
}