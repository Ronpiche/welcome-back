import type { Answer } from "@modules/quiz/entities/answer.entity";

export class Question {
  public label: string;

  public answers: Answer[];
}