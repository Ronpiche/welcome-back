import { FieldValue } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateUpdateRoleDto {
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

  @ApiProperty()
  @IsDateString()
  createdAt?: FieldValue;

  @ApiProperty()
  @IsDateString()
  updatedAt?: FieldValue;
}
