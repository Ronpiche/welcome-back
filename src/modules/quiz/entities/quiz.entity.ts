import { Question } from "./question.entity";

export class Quiz {
  _id: string;

  questions: Question[];
}