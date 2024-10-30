import { Timestamp } from "@google-cloud/firestore";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";

export class WelcomeSubStep {
  @ApiProperty()
  @Expose()
  public _id: string;

  @ApiProperty()
  @Expose()
  public isCompleted: boolean;
}

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
  @Type(() => WelcomeSubStep)
  public subStep: WelcomeSubStep[];
}