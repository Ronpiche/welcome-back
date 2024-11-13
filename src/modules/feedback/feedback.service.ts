import { Injectable } from "@nestjs/common";
import { CreateFeedbackDto } from "@modules/feedback/dto/create-feedback.dto";
import { UpdateFeedbackDto } from "@modules/feedback/dto/update-feedback.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { Feedback } from "@modules/feedback/entities/feedback.entity";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class FeedbackService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.FEEDBACKS, instanceToPlain(createFeedbackDto));
  }

  public async findAll(): Promise<Feedback[]> {
    return this.firestoreService.getAllDocuments<Feedback>(FIRESTORE_COLLECTIONS.FEEDBACKS);
  }

  public async findOne(id: string): Promise<Feedback> {
    return this.firestoreService.getDocument<Feedback>(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
  }

  public async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    await this.findOne(id);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.FEEDBACKS, id, instanceToPlain(updateFeedbackDto));
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);
    const doc = this.firestoreService.getDoc(FIRESTORE_COLLECTIONS.FEEDBACKS, id);
    await this.firestoreService.deleteRecursive(doc);
  }
}