import { ApiProperty } from "@nestjs/swagger";

export class FeedbackAnswer {
  @ApiProperty()
  public _id: string;

  @ApiProperty({
    type: "array",
    items: {
      type: "array",
      items: {
        type: "string",
      },
    },
  })
  public answers: string[][];
}