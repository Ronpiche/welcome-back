import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';
import { FIRESTORE_COLLECTIONS } from '@src/configs/types/Firestore.types';
import { Step } from './entities/step.entity';
import { instanceToPlain } from 'class-transformer';
import { generateStepDates } from './step.utils';
import { HOLIDAY_COUNTRY } from './step.constants';

@Injectable()
export class StepService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(createStepDto: CreateStepDto): Promise<Step> {
    try {
      return (await this.firestoreService.saveDocument(
        FIRESTORE_COLLECTIONS.STEPS,
        instanceToPlain(createStepDto),
      )) as Step;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async findAll(): Promise<Step[]> {
    try {
      return await this.firestoreService.getAllDocuments<Step>(FIRESTORE_COLLECTIONS.STEPS);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(id: string): Promise<Step> {
    try {
      return await this.firestoreService.getDocument<Step>(FIRESTORE_COLLECTIONS.STEPS, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException('Step does not exists', error.getStatus());
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async update(id: string, updateStepDto: UpdateStepDto): Promise<Step> {
    await this.findOne(id);
    const stepToUpdate: Record<string, any> = instanceToPlain(updateStepDto);
    try {
      await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.STEPS, id, stepToUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    try {
      await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.STEPS, id);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  /**
   * Generate steps for an user.
   * @param user - The receiver
   * @returns An array of step with date associated
   */
  async generateSteps(user: WelcomeUser): Promise<Array<{ step: Step; dt: Date }>> {
    try {
      const steps = await this.findAll();
      return generateStepDates(new Date(user.signupDate), new Date(user.arrivalDate), steps, HOLIDAY_COUNTRY);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
