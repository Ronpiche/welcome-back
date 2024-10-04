import { ApiProperty } from "@nestjs/swagger";
import { Question } from "@modules/quiz/entities/question.entity";

export class Quiz {
  @ApiProperty()
  public _id: string;

  @ApiProperty({ isArray: true, type: Question })
  public questions: Question[];
}