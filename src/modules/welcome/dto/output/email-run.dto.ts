import { ApiProperty } from '@nestjs/swagger';

class EmailFullfilled {
  @ApiProperty()
  _id: string;
}

class EmailRejected extends EmailFullfilled {
  @ApiProperty()
  error: string;
}

export class EmailRunOK implements PromiseFulfilledResult<EmailFullfilled> {
  @ApiProperty()
  status: 'fulfilled';
  @ApiProperty()
  value: EmailFullfilled;
}

export class EmailRunKO implements PromiseRejectedResult {
  @ApiProperty()
  status: 'rejected';
  @ApiProperty()
  reason: EmailRejected;
}
