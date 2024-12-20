import { ApiProperty } from "@nestjs/swagger";

export class PracticeVideo {
  @ApiProperty()
  public member: string;

  @ApiProperty()
  public url?: string;

  @ApiProperty()
  public quote: string;
}