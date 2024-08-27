import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class WelcomeStepDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    value && value._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value,
  )
  unlockDate: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    value && value._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value,
  )
  emailSentAt?: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    value && value._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value,
  )
  completedAt?: Date;
}
