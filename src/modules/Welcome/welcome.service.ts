import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '@modules/welcome/dto/input/create-user.dto';
import { UpdateUserDto } from '@modules/welcome/dto/input/update-user.dto';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '@modules/shared/firestore/constants';
import dayjs from 'dayjs';
import { calculateEmailDate } from '@modules/welcome/welcome.utils';
import { NUMBER_OF_STEPS } from '@modules/welcome/constants';
import { WelcomeUser } from './entities/user.entity';

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

  async findAll(filter: any): Promise<WelcomeUser[]> {
    try {
      this.logger.log('[FindAllUsers] - find all users with filter : ', filter);
      return await this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.welcomeUsers,filter) as Array<WelcomeUser>;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(error);
        throw error;
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

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
