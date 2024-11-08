import { Injectable } from "@nestjs/common";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { FeedbackAnswer } from "@modules/feedback-answer/entities/feedback-answer.entity";

@Injectable()
export class FeedbackAnswerService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(
    id: string,
    questionId: string,
    userId: string,
    answers: string[],
  ): Promise<FeedbackAnswer> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);

    return this.firestoreService.saveDocument(
      FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS,
      { _id: userId, answers },
      parentDoc,
    );
  }

  public async findAll(id: string, questionId: string): Promise<FeedbackAnswer[]> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);

    return this.firestoreService.getAllDocuments<FeedbackAnswer>(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, undefined, parentDoc);
  }

  public async findOne(id: string, questionId: string, userId: string): Promise<FeedbackAnswer> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);

    return this.firestoreService.getDocument<FeedbackAnswer>(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, userId, parentDoc);
  }

  public async update(id: string, questionId: string, userId: string, answers: string[]): Promise<FeedbackAnswer> {
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);
    await this.findOne(id, questionId, userId);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, userId, { answers }, parentDoc);
  }

  public async remove(id: string, questionId: string, userId: string): Promise<void> {
    await this.findOne(id, questionId, userId);
    const feedbackDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, feedbackDoc);
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.FEEDBACKS_ANSWERS, userId, parentDoc);
  }
}