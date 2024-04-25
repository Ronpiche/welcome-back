import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MicrosoftUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString({ each: true })
  businessPhones: string[];

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsString()
  givenName: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsString()
  jobTitle: string;

  @ApiProperty()
  @IsEmail()
  mail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  myString: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mobilePhone: null | string;

  @ApiProperty()
  @IsString()
  officeLocation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  preferredLanguage: null | string;

  @ApiProperty()
  @IsString()
  userPrincipalName: string;
}
