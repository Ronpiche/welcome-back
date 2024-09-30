import { FieldValue } from "@google-cloud/firestore";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RoleDto {
  @ApiProperty()
  @IsString()
  app: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  rules: string[];
}

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hub: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  welcome: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  customPersmission?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  createdAt?: FieldValue;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  updatedAt?: FieldValue;
}