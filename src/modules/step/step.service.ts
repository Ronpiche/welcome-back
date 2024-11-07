import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateStepDto } from "@src/modules/step/dto/create-step.dto";
import { UpdateStepDto } from "@src/modules/step/dto/update-step.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { Step } from "@src/modules/step/entities/step.entity";
import { instanceToPlain } from "class-transformer";
import { generateStepDates } from "@src/modules/step/step.utils";
import { HOLIDAY_COUNTRY } from "@src/modules/step/step.constants";

@Injectable()
export class StepService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(createStepDto: CreateStepDto): Promise<Step> {
    return this.firestoreService.saveDocument(
      FIRESTORE_COLLECTIONS.STEPS,
      instanceToPlain(createStepDto),
    );
  }

  public async findAll(): Promise<Step[]> {
    return this.firestoreService.getAllDocuments<Step>(FIRESTORE_COLLECTIONS.STEPS);
  }

  public async findOne(id: string): Promise<Step> {
    return this.firestoreService.getDocument<Step>(FIRESTORE_COLLECTIONS.STEPS, id);
  }

  public async update(id: string, updateStepDto: UpdateStepDto): Promise<Step> {
    const stepToUpdate: Record<string, any> = instanceToPlain(updateStepDto);
    await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.STEPS, id, stepToUpdate);
    
    return this.findOne(id);
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.STEPS, id);
  }

  /**
   * generate array of steps for an user.
   * @param startDate - The date when it starts
   * @param endDate - The date when it ends
   * @returns An array of steps with date associated
   */
  public async generateSteps(startDate: Date, endDate: Date): Promise<{ step: Step; dt: Date }[]> {
    const steps = await this.findAll();

    return generateStepDates(startDate, endDate, steps, HOLIDAY_COUNTRY);
  }
}