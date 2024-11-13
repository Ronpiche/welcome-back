import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";

class RoleMember {
  @ApiProperty({ example: "Lille" })
  @IsString()
  public scope: string;

  @ApiProperty({ example: "agency" })
  @IsString()
  @IsOptional()
  public subscope?: string;

  @ApiProperty({ example: "BusinessOwner" })
  @IsString()
  public role: string;
}

export class CreateMemberDto {
  @ApiProperty({ example: "John" })
  @IsString()
  public firstname: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  public lastname: string;

  @ApiProperty({ example: "male" })
  @IsIn(["male", "female"], { message: "Gender must be either male or female" })
  public gender: "male" | "female";

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public executiveCommittee: boolean;

  @ApiProperty({ isArray: true, type: RoleMember })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleMember)
  public roles: RoleMember[];
}