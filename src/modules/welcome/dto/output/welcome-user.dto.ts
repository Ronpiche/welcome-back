import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { RhUserInfoDto } from '../input/create-user.dto';
import { Timestamp } from '@google-cloud/firestore';
import { WelcomeStepDto } from './welcome-step.dto';

export class WelcomeUserDto {
  @ApiProperty()
  @Expose()
  _id: string;
  @ApiProperty()
  @Expose()
  note: string;
  @ApiProperty()
  @Expose()
  signupDate: string;
  @ApiProperty()
  @Expose()
  lastName: string;
  @ApiProperty()
  @Expose()
  civility: string;
  @ApiProperty()
  @Expose()
  agency: string;
  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    value && value._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value,
  )
  creationDate: Date;
  @ApiProperty()
  @Expose()
  referentRH: RhUserInfoDto;
  @ApiProperty()
  @Expose()
  arrivalDate: string;
  @ApiProperty()
  @Expose()
  firstName: string;
  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    value && value._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value,
  )
  lastUpdate: Date;
  @ApiProperty()
  @Expose()
  email: string;
  @ApiProperty()
  @Expose()
  grade: string;
  @ApiProperty()
  @Expose()
  practice: string;
  @ApiProperty()
  @Expose()
  smileyQuestion: string;
  @ApiProperty()
  @Expose()
  @Type(() => WelcomeStepDto)
  steps: WelcomeStepDto[];
}
