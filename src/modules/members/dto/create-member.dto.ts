import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateRoleDto } from "@modules/members/dto/create-role.dto";

export class CreateMemberDto {
  @ApiProperty({ example: "John" })
  @IsString()
  public firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  public lastName: string;

  @ApiProperty({ example: "male" })
  @IsIn(["male", "female", "other"], { message: "Gender must be either male or female or other" })
  @IsOptional()
  public gender?: "male" | "female" | "other";

  @ApiProperty({ example: "john.doe@127.0.0.1" })
  @IsString()
  public email: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public isExecutiveCommittee?: boolean;

  @ApiProperty({ isArray: true, type: CreateRoleDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  public roles: CreateRoleDto[];
}