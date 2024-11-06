import { ApiProperty } from "@nestjs/swagger";

export class UserSubStep {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public isCompleted: boolean;
}