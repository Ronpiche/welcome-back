import { Timestamp } from "@google-cloud/firestore";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

export class WelcomeStepDto {
  @ApiProperty()
  @Expose()
  public _id: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  public unlockDate: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  public emailSentAt?: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  public completedAt?: Date;

  @ApiProperty()
  @Expose()
  public subStepsCompleted: number;
}