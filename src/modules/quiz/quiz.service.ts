import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
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
    try {
      return await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.STEPS, instanceToPlain(createQuizDto));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException("Internal Server Error");
      }
    }
  }

  public async findAll(): Promise<Quiz[]> {
    try {
      return await this.firestoreService.getAllDocuments<Quiz>(FIRESTORE_COLLECTIONS.QUIZZES);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async findOne(id: string): Promise<Quiz> {
    try {
      return await this.firestoreService.getDocument<Quiz>(FIRESTORE_COLLECTIONS.QUIZZES, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException("Step does not exists", error.getStatus());
      } else {
        throw new InternalServerErrorException("Internal Server Error");
      }
    }
  }

  public async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    await this.findOne(id);
    const quizToUpdate: Record<string, any> = instanceToPlain(updateQuizDto);
    try {
      await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.QUIZZES, id, quizToUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException("Internal Server Error");
      }
    }
    return this.findOne(id);
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);
    try {
      await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.QUIZZES, id);
    } catch {
      throw new InternalServerErrorException("Internal Server Error");
    }
  }

  /**
   * check answers validity.
   * @param quizId - The quiz ID
   * @param questionIndex - The index of the question
   * @param answerIndexes - The array of selected answers
   * @returns Validity of the answers
   */
  public async isValid(quizId: string, questionIndex: number, answerIndexes: number[]): Promise<boolean> {
    try {
      const quiz = await this.findOne(quizId);

      return quiz.questions[questionIndex].answers.every((answer, i) => (answer.isTrue && answerIndexes.includes(i)) || (!answer.isTrue && !answerIndexes.includes(i)));
    } catch {
      throw new InternalServerErrorException("Internal Server Error");
    }
  }
}
