import { ApiProperty } from "@nestjs/swagger";
import { Answer } from "@modules/quiz/entities/answer.entity";

export class Question {
  @ApiProperty()
  public label: string;

  @ApiProperty()
  public hint?: string;

  @ApiProperty({ isArray: true, type: Answer })
  public answers: Answer[];
}