import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from '@modules/welcome/dto/input/create-user.dto';
import { UpdateUserDto } from '@modules/welcome/dto/input/update-user.dto';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '@modules/shared/firestore/constants';
import { Timestamp } from '@google-cloud/firestore';
import { calculateEmailDate } from '@modules/welcome/welcome.utils';
import { WelcomeUser } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class WelcomeService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly logger: Logger,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const now = Timestamp.now();
      let id = uuidv4();
      if (process.env.NODE_ENV === 'test') {
        id = 'test-integration';
      }
      const dbUser: WelcomeUser = {
        _id: id,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        grade: createUserDto.grade,
        practice: createUserDto.practice,
        email: createUserDto.email,
        arrivalDate: createUserDto.arrivalDate,
        signupDate: createUserDto.signupDate,
        referentRH: instanceToPlain(createUserDto.referentRH),
        civility: createUserDto.civility,
        note: createUserDto.note ? createUserDto.note : '',
        agency: createUserDto.agency,
        hiringProcessEvaluation: '0',
        communitiesQuestions: {},
        satisfactionQuestions: {},
        personnalProject: '',
        appGames: {},
        creationDate: now,
        lastUpdate: now,
        steps: calculateEmailDate(new Date(createUserDto.signupDate), new Date(createUserDto.arrivalDate)).map(
          (unlockDate, _id) => ({
            _id,
            unlockDate: Timestamp.fromDate(new Date(unlockDate)),
          }),
        ),
      };

      return await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.welcomeUsers, dbUser);
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(error);
        throw error;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async findAll(filter: any): Promise<WelcomeUser[]> {
    try {
      this.logger.log('[FindAllUsers] - find all users with filter : ', filter);
      return (await this.firestoreService.getAllDocuments(
        FIRESTORE_COLLECTIONS.welcomeUsers,
        filter,
      )) as Array<WelcomeUser>;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(error);
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(id: string): Promise<WelcomeUser> {
    try {
      return (await this.firestoreService.getDocument(FIRESTORE_COLLECTIONS.welcomeUsers, id)) as WelcomeUser;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error('User is not registered in welcome');
        throw new HttpException('User is not registered in welcome', error.getStatus());
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    try {
      await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.welcomeUsers, id);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<WelcomeUser> {
    const userToUpdate: Record<string, any> = instanceToPlain(updateUserDto);
    userToUpdate['lastUpdate'] = Timestamp.now();
    try {
      await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.welcomeUsers, id, userToUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(error);
        throw error;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
    return (await this.findOne(id)) as WelcomeUser;
  }

  async transformDbOjectStringsToArray(propertyName: string): Promise<{ status: string }> {
    await this.firestoreService.transformToObjectAndSaveProperty(FIRESTORE_COLLECTIONS.welcomeUsers, propertyName);
    return { status: 'success' };
  }
}
