import { Injectable } from "@nestjs/common";
import { CreateQuizDto } from "@modules/quiz/dto/create-quiz.dto";
import { UpdateQuizDto } from "@modules/quiz/dto/update-quiz.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { Quiz } from "@modules/quiz/entities/quiz.entity";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class QuizService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.QUIZZES, instanceToPlain(createQuizDto));
  }

  public async findAll(): Promise<Quiz[]> {
    return this.firestoreService.getAllDocuments<Quiz>(FIRESTORE_COLLECTIONS.QUIZZES);
  }

  public async findOne(id: string): Promise<Quiz> {
    return this.firestoreService.getDocument<Quiz>(FIRESTORE_COLLECTIONS.QUIZZES, id);
  }

  public async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    await this.findOne(id);
    await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.QUIZZES, id, instanceToPlain(updateQuizDto));

    return this.findOne(id);
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.QUIZZES, id);
  }

  /**
   * check answers validity.
   * @param quizId - The quiz ID
   * @param questionIndex - The index of the question
   * @param answerIndexes - The array of indexes of selected answers
   * @returns Validity of the answers
   */
  public async isValid(quizId: string, questionIndex: number, answerIndexes: number[]): Promise<boolean> {
    const quiz = await this.findOne(quizId);

    return quiz.questions[questionIndex].answers.every((answer, i) => answer.isTrue && answerIndexes.includes(i) || !answer.isTrue && !answerIndexes.includes(i));
  }
}