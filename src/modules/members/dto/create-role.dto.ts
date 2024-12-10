import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: "agency" })
  @IsString()
  public scope: string;

  @ApiProperty({ example: "Lille" })
  @IsString()
  @IsOptional()
  public subscope?: string;

  @ApiProperty({ example: "BusinessOwner" })
  @IsString()
  public role: string;
}