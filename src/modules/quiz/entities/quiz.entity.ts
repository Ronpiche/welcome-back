import type { Question } from "@modules/quiz/entities/question.entity";

export class Quiz {
  public _id: string;

  public questions: Question[];
}