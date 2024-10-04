import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class QuizUserAnswerDto {
  @ApiProperty({
    example: 0,
    description: "Index of the question.",
  })
  @IsNumber()
  @Min(0)
  public questionIndex: number;

  @ApiProperty({
    example: [0, 1],
    description: "Array of indexes of selected answers.",
  })
  @IsNumber({}, { each: true })
  public answerIndexes: number[];
}