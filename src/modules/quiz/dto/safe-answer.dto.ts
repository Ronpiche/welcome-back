import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SafeAnswerDto {
  @ApiProperty()
  @Expose()
  public label: string;
}