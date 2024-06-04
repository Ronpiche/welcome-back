import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GRADE } from '../../types/user.type';

export class RhUserInfoDto {
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
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEnum(GRADE)
  @IsNotEmpty()
  grade: string;

  @ApiProperty()
  @IsNotEmpty()
  arrivalDate: number;

  @ApiProperty()
  @IsNotEmpty()
  signupDate: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => RhUserInfoDto)
  referentRH: RhUserInfoDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  civility: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  agency: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;
}
