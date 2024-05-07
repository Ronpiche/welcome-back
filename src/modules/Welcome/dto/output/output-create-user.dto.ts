import { ApiProperty } from '@nestjs/swagger';

export class OutputCreateUserDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  arrivalDate: number;
  @ApiProperty()
  accessExpirationDate: number;
  @ApiProperty()
  nextEmailDate: number;
  @ApiProperty()
  currentSection: number;
  @ApiProperty()
  scorePresentationGame: number;
  @ApiProperty()
  scoreCommunitiesGame: number;
  @ApiProperty()
  hiringProcessEvaluation: boolean;
}
