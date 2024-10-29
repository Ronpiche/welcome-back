import { ApiProperty } from "@nestjs/swagger";

class EmailFullfilled {
  @ApiProperty()
  public _id: string;
}

class EmailRejected extends EmailFullfilled {
  @ApiProperty()
  public error: string;
}

export class EmailRunOK implements PromiseFulfilledResult<EmailFullfilled> {
  @ApiProperty()
  public status: "fulfilled";

  @ApiProperty()
  public value: EmailFullfilled;
}

export class EmailRunKO implements PromiseRejectedResult {
  @ApiProperty()
  public status: "rejected";

  @ApiProperty()
  public reason: EmailRejected;
}