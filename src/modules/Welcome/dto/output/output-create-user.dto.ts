import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OutputCreateUserDto {
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
  finishedOnBoarding: boolean;
  @ApiProperty()
  @Expose()
  civility: string;
  @ApiProperty()
  @Expose()
  stepEmailSent: Array<boolean>;
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
  referentRH: object;
  @ApiProperty()
  @Expose()
  arrivalDate: string;
  @ApiProperty()
  @Expose()
  currentStep: string;
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
  finishedCurrentStep: boolean;
  @ApiProperty()
  @Expose()
  communitiesQuestions: string;
  @ApiProperty()
  @Expose()
  currentPage: string;
  @ApiProperty()
  @Expose()
  emailDates: Array<Date>;
  @ApiProperty()
  @Expose()
  maxStep: string;
}
