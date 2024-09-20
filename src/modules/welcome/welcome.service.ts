import { Step } from '@modules/step/entities/step.entity';
import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from '@modules/welcome/dto/input/create-user.dto';
import { UpdateUserDto } from '@modules/welcome/dto/input/update-user.dto';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '@src/configs/types/Firestore.types';
import { Filter, Timestamp } from '@google-cloud/firestore';
import { WelcomeUser } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { instanceToPlain } from 'class-transformer';
import { StepService } from '@modules/step/step.service';
import { MailerService } from '@nestjs-modules/mailer';
import markdownit, { StateCore } from 'markdown-it';

const APP_NAME = 'Welcome';
const APP_URL = 'http://localhost:3000';

@Injectable()
export class WelcomeService {
  private readonly md = markdownit();

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly stepService: StepService,
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {
    this.md.core.ruler.after('normalize', 'variables', WelcomeService.markdownVariable);
  }

  static markdownVariable(state: StateCore) {
    state.src = state.src.replaceAll(/{{\s?(\w+)\s?}}/g, (_, name) => state.env[name] || ''.padStart(name.length, '█'));
  }

  async createUser(createUserDto: CreateUserDto): Promise<WelcomeUser> {
    try {
      let id = uuidv4();
      if (process.env.NODE_ENV === 'test') {
        id = 'test-integration';
      }
      const now = Timestamp.now();
      const dbUser: WelcomeUser = Object.assign(instanceToPlain(createUserDto) as CreateUserDto, {
        _id: id,
        steps: [],
        creationDate: now,
        lastUpdate: now,
      });

      dbUser.steps.push(
        ...(await this.stepService.generateSteps(dbUser)).map((s) => ({
          _id: s.step._id,
          unlockDate: Timestamp.fromDate(s.dt),
          subStep: s.step.subStep,
        })),
      );

      return (await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, dbUser)) as WelcomeUser;
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
      return (
        await this.firestoreService.getAllDocuments<WelcomeUser>(FIRESTORE_COLLECTIONS.WELCOME_USERS, filter)
      ).map((u) => new WelcomeUser(u));
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
      return new WelcomeUser(
        await this.firestoreService.getDocument<WelcomeUser>(FIRESTORE_COLLECTIONS.WELCOME_USERS, id),
      );
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
      await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, id);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<WelcomeUser> {
    const userToUpdate = Object.assign(instanceToPlain(updateUserDto), { lastUpdate: Timestamp.now() });
    try {
      await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, id, userToUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(error);
        throw error;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
    return await this.findOne(id);
  }

  async transformDbOjectStringsToArray(propertyName: string): Promise<{ status: string }> {
    await this.firestoreService.transformToObjectAndSaveProperty(FIRESTORE_COLLECTIONS.WELCOME_USERS, propertyName);
    return { status: 'success' };
  }

  /**
   * Update date of email sent on unlocked steps.
   * @param user - The user to update
   * @param unlockedSteps - The list of steps to update
   * @returns The database result
   */
  private async updateEmailSteps(user: WelcomeUser, unlockedSteps: string[]) {
    const unlockEmailSentAt = Timestamp.now();
    return await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, user._id, {
      steps: user.steps.map((step) =>
        unlockedSteps.includes(step._id) ? Object.assign(step, { unlockEmailSentAt }) : step,
      ),
    });
  }

  /**
   * Get all of the newly unlocked steps.
   * @param user - The user to check
   * @param now - The actual date
   * @returns The list of unlocked steps
   */
  getNewlyUnlockedSteps(user: WelcomeUser, now: Date) {
    return user.steps
      ? user.steps.reduce((acc, step) => {
          if (!step.unlockEmailSentAt && step.unlockDate.toDate() <= now) {
            acc.push(step._id);
          }
          return acc;
        }, [] as string[])
      : [];
  }

  /**
   * Launch a task that search all of the newcomers and send them an email if they have unloked a step.
   * If an user have multiple steps unlocked at once, we only notify him once by taking the email content of the first unlocked step.
   * @param now - The actual date
   * @returns List of email sent with status
   */
  async run(now: Date) {
    this.logger.log('[Step] - send email to users');
    const steps = await this.stepService.findAll();
    const users = await this.findAll(Filter.where('arrivalDate', '>', now.toISOString()));
    const userEmails = [];
    users.forEach((user) => {
      const unlockedSteps = this.getNewlyUnlockedSteps(user, now);
      const step = unlockedSteps[0] !== undefined ? steps.find((step) => step._id === unlockedSteps[0]) : undefined;
      if (step && step.unlockEmail) {
        userEmails.push(
          new Promise((resolve, reject) => {
            this.mailerService
              .sendMail({
                to: user.email,
                subject: step.unlockEmail.subject,
                html: this.md.render(step.unlockEmail.body, {
                  app_name: APP_NAME,
                  app_url: APP_URL,
                  user_firstName: user.firstName,
                  user_lastName: user.lastName,
                  manager_firstName: user.referentRH.firstName,
                  manager_lastName: user.referentRH.lastName,
                  step_id: step._id,
                }),
              })
              .then(async () => {
                await this.updateEmailSteps(user, unlockedSteps);
                resolve({ _id: user._id });
              })
              .catch(({ message }) => reject({ _id: user._id, message }));
          }),
        );
      }
    });
    return await Promise.allSettled(userEmails);
  }

  /**
   * Update the completion of a step for an user.
   * @param userId - The id of the user
   * @param stepId - The id of the step completed
   * @param now - The actual date
   * @returns The status of the completed step
   */
  async completeStep(userId: WelcomeUser['_id'], stepId: Step['_id'], now: Date) {
    const completedAt = Timestamp.fromDate(now);
    const user = await this.findOne(userId);
    const step = await this.stepService.findOne(stepId);
    await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, user._id, {
      steps: user.steps.map((s) => (s._id === stepId ? Object.assign(s, { completedAt }) : s)),
    });
    if (step.completionEmailManager) {
      await this.mailerService.sendMail({
        to: user.referentRH.email,
        subject: step.completionEmailManager.subject,
        html: this.md.render(step.completionEmailManager.body, {
          app_name: APP_NAME,
          app_url: APP_URL,
          user_firstName: user.firstName,
          user_lastName: user.lastName,
          manager_firstName: user.referentRH.firstName,
          manager_lastName: user.referentRH.lastName,
          step_id: step._id,
        }),
      });
    }
    if (step.completionEmail) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: step.completionEmail.subject,
        html: this.md.render(step.completionEmail.body, {
          app_name: APP_NAME,
          app_url: APP_URL,
          user_firstName: user.firstName,
          user_lastName: user.lastName,
          manager_firstName: user.referentRH.firstName,
          manager_lastName: user.referentRH.lastName,
          step_id: step._id,
        }),
      });
    }
    return { status: 'OK' };
  }
}
