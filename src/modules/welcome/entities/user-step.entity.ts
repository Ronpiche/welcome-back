import { ApiProperty } from "@nestjs/swagger";
import type { Timestamp } from "@google-cloud/firestore";

export class UserStep {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public unlockDate: Timestamp;

  @ApiProperty()
  public unlockEmailSentAt?: Timestamp;

  @ApiProperty()
  public completedAt?: Timestamp;

  @ApiProperty()
  public subStepsCompleted: number;
}