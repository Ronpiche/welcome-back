import { ApiProperty } from "@nestjs/swagger";
import type { Timestamp } from "@google-cloud/firestore";
import { UserStep } from "@modules/welcome/entities/user-step.entity";
import { Practice } from "@modules/welcome/types/user.enum";
import { HrReferent } from "@modules/welcome/entities/hr-referent.entity";

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

  @ApiProperty({ isArray: true, enum: Practice, enumName: "Practice" })
  public practices: Practice[];

  @ApiProperty({ isArray: true, type: UserStep })
  public steps: UserStep[];
}