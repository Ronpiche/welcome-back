import { Injectable } from "@nestjs/common";
import { CreateFeedbackQuestionDto } from "@modules/feedback-question/dto/create-feedback-question.dto";
import { UpdateFeedbackQuestionDto } from "@modules/feedback-question/dto/update-feedback-question.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { FeedbackQuestion } from "@modules/feedback-question/entities/feedback-question.entity";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class FeedbackQuestionService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(id: string, createFeedbackDto: CreateFeedbackQuestionDto): Promise<FeedbackQuestion> {
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);

    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, instanceToPlain(createFeedbackDto), parentDoc);
  }

  public async findAll(id: string): Promise<FeedbackQuestion[]> {
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);

    return this.firestoreService.getAllDocuments<FeedbackQuestion>(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, undefined, parentDoc);
  }

  public async findOne(id: string, questionId: string): Promise<FeedbackQuestion> {
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);

    return this.firestoreService.getDocument<FeedbackQuestion>(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, parentDoc);
  }

  public async update(id: string, questionId: string, updateFeedbackDto: UpdateFeedbackQuestionDto): Promise<FeedbackQuestion> {
    await this.findOne(id, questionId);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, instanceToPlain(updateFeedbackDto), parentDoc);
  }

  public async remove(id: string, questionId: string): Promise<void> {
    await this.findOne(id, questionId);
    const parentDoc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    const doc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS_QUESTIONS, questionId, parentDoc);
    await this.firestoreService.deleteRecursive(doc);
  }
}