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
  appGames: object;
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
  personnalProject: string;
  @ApiProperty()
  @Expose()
  hiringProcessEvaluation: string;
  @ApiProperty()
  @Expose()
  @Type(() => String)
  @Transform((value: any) =>
    value.obj.creationDate instanceof Timestamp
      ? value.obj.creationDate.toDate().toISOString()
      : value.obj.creationDate,
  )
  creationDate: string;
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
  satisfactionQuestions: string;
  @ApiProperty()
  @Expose()
  @Type(() => String)
  @Transform((value: any) =>
    value.obj.lastUpdate instanceof Timestamp ? value.obj.lastUpdate.toDate().toISOString() : value.obj.lastUpdate,
  )
  lastUpdate: string;
  @ApiProperty()
  @Expose()
  communitiesQuestions: string;
  @ApiProperty()
  @Expose()
  currentPage: string;
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
  @Type(() => WelcomeStepDto)
  steps: WelcomeStepDto;
}
