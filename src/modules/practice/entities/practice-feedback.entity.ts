import { ApiProperty } from "@nestjs/swagger";

export class PracticeFeedback {
  @ApiProperty()
  public client: string;

  @ApiProperty()
  public benefits: string;

  @ApiProperty()
  public context: string;

  @ApiProperty()
  public ourApproach: string;
}