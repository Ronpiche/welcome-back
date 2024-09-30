import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";

class RoleMember {
  @ApiProperty({ example: "Lille" })
  @IsString()
  scope: string;

  @ApiProperty({ example: "agency" })
  @IsString()
  @IsOptional()
  subscope?: string;

  @ApiProperty({ example: "BusinessOwner" })
  @IsString()
  role: string;
}

export class CreateMemberDto {
  @ApiProperty({ example: "John" })
  @IsString()
  firstname: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  lastname: string;

  @ApiProperty({ example: "male" })
  @IsIn(["male", "female"], { message: "Gender must be either male or female" })
  gender: "male" | "female";

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  executiveCommittee: boolean;

  @ApiProperty({ isArray: true, type: RoleMember })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleMember)
  roles: RoleMember[];
}