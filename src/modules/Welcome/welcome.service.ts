import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/input/create-user.dto';
import { UpdateUserDto } from './dto/input/update-user.dto';
import { FirestoreService } from '../shared/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '../shared/firestore/constants';
import dayjs from 'dayjs';
import { calculateEmailDate } from './welcome.utils';
import { NUMBER_OF_STEPS } from './constants';

@Injectable()
export class WelcomeService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly logger: Logger,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const now = dayjs().format();

      const dbUser = {
        arrivalDate: createUserDto.arrivalDate,
        signupDate: createUserDto.signupDate,
        referentRH: createUserDto.referentRH.email,
        civility: createUserDto.civility,
        emailDates: calculateEmailDate(createUserDto.signupDate, createUserDto.arrivalDate),
        note: createUserDto.note ? createUserDto.note : '',
        agency: createUserDto.agency,
        currentStep: 0,
        currentPage: 0,
        maxStep: 0,
        stepEmailSent: new Array(NUMBER_OF_STEPS).fill(false),
        finishedCurrentStep: false,
        finishedOnBoarding: false,
        createdAt: now,
        updatedAt: now,
      };

      //TODO: send first email now updated by AK
      dbUser.emailDates[0] = now;

      this.logger.log('[createUser] - saving user data to database: ', dbUser);

      return await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.welcomeUsers, dbUser);
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(error);
        throw error;
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAll(): Promise<any> {}

  findOne(_id) {
    throw new Error('No implemented yet');
  }

  update(id: string, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
