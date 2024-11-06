import { ApiProperty } from "@nestjs/swagger";

export class HrReferent {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  public email: string;
}