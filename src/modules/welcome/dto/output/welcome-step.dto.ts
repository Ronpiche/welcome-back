import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class WelcomeStepDto {
  @ApiProperty()
  @Expose()
  _id: number;

  @ApiProperty()
  @Expose()
  @Type(() => String)
  @Transform((value: any) => {
    return value.obj.unlockDate instanceof Timestamp
      ? value.obj.unlockDate.toDate().toISOString()
      : value.obj.unlockDate;
  })
  unlockDate: string;

  @ApiProperty()
  @Expose()
  @Type(() => String)
  @Transform((value: any) =>
    value.obj.emailSentAt instanceof Timestamp ? value.obj.emailSentAt.toDate().toISOString() : value.obj.emailSentAt,
  )
  emailSentAt?: string;

  @ApiProperty()
  @Expose()
  @Type(() => String)
  @Transform((value: any) =>
    value.obj.completedAt instanceof Timestamp ? value.obj.completedAt.toDate().toISOString() : value.obj.completedAt,
  )
  completedAt?: string;
}
