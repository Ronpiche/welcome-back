import { ApiProperty } from "@nestjs/swagger";
import type { Timestamp } from "@google-cloud/firestore";
import { HrReferent } from "./hr-referent.entity";
import { UserStep } from "./user-step.entity";

export class WelcomeUser {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public note: string;

  @ApiProperty()
  public signupDate: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  public civility: string;

  @ApiProperty()
  public agency: string;

  @ApiProperty()
  public creationDate: Timestamp;

  @ApiProperty({ type: HrReferent })
  public hrReferent: HrReferent;

  @ApiProperty()
  public arrivalDate: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastUpdate: Timestamp;

  @ApiProperty()
  public grade: string;

  @ApiProperty()
  public practice: string;

  @ApiProperty({ isArray: true, type: UserStep })
  public steps: UserStep[];
}