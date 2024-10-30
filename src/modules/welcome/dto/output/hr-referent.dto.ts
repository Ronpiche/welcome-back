import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class HrReferentDto {
  @ApiProperty()
  @Expose()
  public _id: string;

  @ApiProperty()
  @Expose()
  public firstName: string;

  @ApiProperty()
  @Expose()
  public lastName: string;

  @ApiProperty()
  @Expose()
  public email: string;
}