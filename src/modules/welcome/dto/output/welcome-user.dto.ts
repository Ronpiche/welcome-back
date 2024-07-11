import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RhUserInfoDto } from '../input/create-user.dto';

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
}
