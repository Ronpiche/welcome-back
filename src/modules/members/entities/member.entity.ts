import { ApiProperty } from "@nestjs/swagger";
import { RoleMember } from "@modules/members/entities/role.entity";

export class Member {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  public gender?: "male" | "female" | "other";

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public isExecutiveCommittee?: boolean;

  @ApiProperty({ type: RoleMember })
  public roles: RoleMember[];
}