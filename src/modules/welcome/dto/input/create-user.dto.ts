import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GRADE, PRACTICE } from '../../types/user.enum';

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
  @IsEnum(PRACTICE)
  @IsNotEmpty()
  practice: string;

  @ApiProperty()
  @IsNotEmpty()
  arrivalDate: string;

  @ApiProperty()
  @IsNotEmpty()
  signupDate: string;

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
