import { ApiProperty } from "@nestjs/swagger";

export class RoleMember {
  @ApiProperty()
  public scope: string;

  @ApiProperty()
  public subscope?: string;

  @ApiProperty()
  public role: string;
}