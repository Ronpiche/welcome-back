import { ApiProperty } from "@nestjs/swagger";
import { QuestionType } from "@modules/feedback-question/types/question-type.enum";

export class FeedbackQuestion {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public label: string;

  @ApiProperty()
  public type: QuestionType;

  @ApiProperty()
  public answers: string[];

  @ApiProperty()
  public minNumberOfAnswers: number;

  @ApiProperty()
  public maxNumberOfAnswers: number;
}