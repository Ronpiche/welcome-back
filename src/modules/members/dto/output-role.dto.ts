import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class OutputRoleDto {
  @ApiProperty()
  @Expose()
  public scope: string;

  @ApiProperty()
  @Expose()
  public subscope?: string;

  @ApiProperty()
  @Expose()
  public role: string;
}