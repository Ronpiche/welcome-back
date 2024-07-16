import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class EmailRun {
  @ApiProperty()
  _id: string;
}

class EmailRunError extends EmailRun {
  @ApiProperty()
  error: string;
}

export class EmailRunOK implements PromiseFulfilledResult<EmailRun> {
  @ApiProperty()
  status: 'fulfilled';
  @ApiProperty()
  value: EmailRun;
}

export class EmailRunKO {
  @ApiProperty({
    enum: ['fulfilled', 'rejected'],
  })
  status: string;
  @ApiPropertyOptional()
  value?: EmailRun;
  @ApiPropertyOptional()
  reason?: EmailRunError;
}
