import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { OutputRoleDto } from "@modules/members/dto/output-role.dto";

export class OutputMembersDto {
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
  public gender?: "male" | "female";

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public isExecutiveCommittee?: boolean;

  @ApiProperty()
  @Expose()
  @Type(() => OutputRoleDto)
  public roles: OutputRoleDto[];
}