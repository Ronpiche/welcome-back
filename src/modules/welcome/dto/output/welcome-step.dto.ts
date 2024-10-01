import { Timestamp } from "@google-cloud/firestore";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";

export class WelcomeSubStep {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  isCompleted: boolean;
}

export class WelcomeStepDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  unlockDate: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  emailSentAt?: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  completedAt?: Date;

  @ApiProperty()
  @Expose()
  @Type(() => WelcomeSubStep)
  subStep: WelcomeSubStep[];
}