import { Injectable } from "@nestjs/common";
import { CreatePracticeDto } from "@modules/practice/dto/create-practice.dto";
import { UpdatePracticeDto } from "@modules/practice/dto/update-practice.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { Practice } from "@modules/practice/entities/practice.entity";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class PracticeService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(createPracticeDto: CreatePracticeDto): Promise<Practice> {
    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.PRACTICES, instanceToPlain(createPracticeDto));
  }

  public async findAll(): Promise<Practice[]> {
    return this.firestoreService.getAllDocuments<Practice>(FIRESTORE_COLLECTIONS.PRACTICES);
  }

  public async findOne(id: string): Promise<Practice> {
    return this.firestoreService.getDocument<Practice>(FIRESTORE_COLLECTIONS.PRACTICES, id);
  }

  public async update(id: string, updatePracticeDto: UpdatePracticeDto): Promise<Practice> {
    await this.findOne(id);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.PRACTICES, id, instanceToPlain(updatePracticeDto));
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.PRACTICES, id);
  }
}