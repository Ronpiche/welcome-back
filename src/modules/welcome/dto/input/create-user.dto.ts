import { GRADE, PRACTICE } from '@modules/welcome/types/user.enum';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RhUserInfoDto {
  @ApiProperty({ example: 'abcd-1234' })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ example: 'Joe' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Bloggs' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'joe.bloggs@127.0.0.1' })
  //@IsEmail() TODO: Uncomment this when production ready
  @IsNotEmpty()
  email: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@127.0.0.1' })
  //@IsEmail() TODO: Uncomment this when production ready
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ enum: GRADE, enumName: 'Grade' })
  @IsEnum(GRADE)
  @IsNotEmpty()
  grade: GRADE;

  @ApiProperty({ enum: PRACTICE, enumName: 'Practice' })
  @IsEnum(PRACTICE)
  @IsNotEmpty()
  practice: PRACTICE;

  @ApiProperty({ example: new Date(new Date().setDate(new Date().getDate() + 75)).toISOString().substring(0, 10) })
  @IsNotEmpty()
  arrivalDate: string;

  @ApiProperty({ example: new Date().toISOString().substring(0, 10) })
  @IsNotEmpty()
  signupDate: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => RhUserInfoDto)
  referentRH: RhUserInfoDto;

  @ApiProperty({ example: 'M' })
  @IsString()
  @IsNotEmpty()
  civility: string;

  @ApiProperty({ example: 'Lille' })
  @IsString()
  @IsNotEmpty()
  agency: string;

  @ApiProperty({ example: 'Example user' })
  @IsString()
  note: string;
}
