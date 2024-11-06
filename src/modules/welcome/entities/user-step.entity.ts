import { ApiProperty } from "@nestjs/swagger";
import type { Timestamp } from "@google-cloud/firestore";
import { UserSubStep } from "./user-sub-step.entity";

export class UserStep {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public unlockDate: Timestamp;

  @ApiProperty()
  public unlockEmailSentAt?: Timestamp;

  @ApiProperty()
  public completedAt?: Timestamp;

  @ApiProperty({ isArray: true, type: UserSubStep })
  public subStep: UserSubStep[];
}