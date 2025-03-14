import { Step } from "@modules/step/entities/step.entity";
import { toISO8601Format } from "@src/helpers/date.helpers";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateUserDto } from "@modules/welcome/dto/input/create-user.dto";
import { UpdateUserDto } from "@modules/welcome/dto/input/update-user.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { Filter, Timestamp } from "@google-cloud/firestore";
import { WelcomeUser } from "@modules/welcome/entities/user.entity";
import { UserStep } from "@modules/welcome/entities/user-step.entity";
import { instanceToPlain } from "class-transformer";
import { StepService } from "@modules/step/step.service";
import { MailService } from "@src/services/mail/mail.service";
import { GipService } from "@src/services/gip/gip.service";
import crypto from "crypto";

@Injectable()
export class WelcomeService {
  public constructor(
    private readonly firestoreService: FirestoreService,
    private readonly gipService: GipService,
    private readonly stepService: StepService,
    private readonly mailService: MailService,
    private readonly logger: Logger,
  ) {
  }

  /**
   * get all of the newly unlocked steps.
   * @param user - The user to check
   * @param now - The actual date
   * @returns The list of unlocked steps
   */
  private static getNewlyUnlockedSteps(user: WelcomeUser, now: Date): WelcomeUser["steps"][0]["_id"][] {
    return user.steps !== undefined ? user.steps.reduce<string[]>((acc, step) => {
      if (step.unlockEmailSentAt === undefined && step.unlockDate.toDate() <= now) {
        acc.push(step._id);
      }
      return acc;
    }, []) : [];
  }

  private static generatePassword(length = 12, characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?.:/!@"): string {
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map(x => characters[x % characters.length])
      .join("");
  }

  public async createUser(createUserDto: CreateUserDto): Promise<WelcomeUser> {
    const password = WelcomeService.generatePassword();
    const step = await this.stepService.findOne("1");

    const welcomeUser = this.mapCreateUserDtoToWelcomeUser(createUserDto);

    try {
      await this.mailService.inviteNewUserMail(createUserDto, password);
      await this.mailService.sendStepMail(welcomeUser, step.unlockEmail, "1");
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

    const gip = await this.gipService.createUser({ email: createUserDto.email, password, displayName: `${createUserDto.firstName} ${createUserDto.lastName}` });

    return this.createDbUser(Object.assign(createUserDto, { _id: gip.uid }));
  }

  public async findAll(arrivalDateStart?: Date, arrivalDateEnd?: Date): Promise<WelcomeUser[]> {
    const filters: Filter[] = [];
    if (arrivalDateStart !== undefined) {
      filters.push(Filter.where("arrivalDate", ">=", toISO8601Format(arrivalDateStart)));
    }
    if (arrivalDateEnd !== undefined) {
      filters.push(Filter.where("arrivalDate", "<", toISO8601Format(arrivalDateEnd)));
    }
    return this.firestoreService.getAllDocuments<WelcomeUser>(FIRESTORE_COLLECTIONS.WELCOME_USERS, Filter.and(...filters));
  }

  public async findOne(id: string): Promise<WelcomeUser> {
    return this.firestoreService.getDocument<WelcomeUser>(FIRESTORE_COLLECTIONS.WELCOME_USERS, id);
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, id);
    await this.gipService.deleteUser(id);
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<WelcomeUser> {
    const userToUpdate = Object.assign(instanceToPlain(updateUserDto), { lastUpdate: Timestamp.now() });
    await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, id, userToUpdate);

    return this.findOne(id);
  }

  /**
   * launch a task that search all of the newcomers and send them an email if they have unlocked a step.
   * If an user have multiple steps unlocked at once, we only notify him once by taking the email content of the first unlocked step.
   * @param now - The actual date
   * @returns List of email sent with status
   */
  public async run(now: Date): Promise<PromiseSettledResult<{ _id: WelcomeUser["_id"] }>[]> {
    const steps = await this.stepService.findAll();
    const users = await this.findAll(now);
    const userEmails = [];

    this.logger.debug(`User count : ${users.length}`);

    // for each User
    users.forEach(user => {
      // we get all the new Steps unlocked
      const unlockedSteps = WelcomeService.getNewlyUnlockedSteps(user, now);
      // selecting the most recent step in the list (fallback case : undefined)
      const step = unlockedSteps[0] !== undefined ? steps.find(s => s._id === unlockedSteps[0]) : undefined;

      this.logger.debug(user.firstName);

      // if the Step is valid, generate a Promise for an email and for store the state in db
      if (step?.unlockEmail !== undefined) {
        userEmails.push(this.getStepEmailPromiseThenSaveState(user, unlockedSteps, step));
      }
    });

    return Promise.allSettled(userEmails);
  }

  public async getStepEmailPromiseThenSaveState(user: WelcomeUser, unlockedSteps: string[], step: Step): Promise<void> {
    await this.updateEmailSteps(user, unlockedSteps);
    await this.mailService.sendStepMail(user, step.unlockEmail, step._id);
  }

  /**
   * update the completion of a step for a user.
   * @param userId - The id of the user
   * @param stepId - The id of the step completed
   * @param subStep - The index of the sub step completed
   */
  public async updateSubStep(userId: WelcomeUser["_id"], stepId: Step["_id"], subStep: Step["subSteps"]): Promise<UserStep[]> {
    const completedAt = Timestamp.now();
    const MAX_STEP_ID = 4;
    const nextStepId = Number(stepId) + 1;
    const user = await this.findOne(userId);
    const step = await this.stepService.findOne(stepId);
    let nextStep: Step | undefined;

    if (nextStepId > MAX_STEP_ID) {
      nextStep = undefined;
    } else {
      nextStep = await this.stepService.findOne(nextStepId.toString());
    }
    const newSteps = user.steps.map(s => {
      if (s._id !== stepId) {
        return s;
      }
      return {
        ...s,
        subStepsCompleted: subStep,
      };
    });
    const isStepCompleted = newSteps.find(s => s._id === stepId).subStepsCompleted === step.subSteps;
    if (isStepCompleted) {
      newSteps.find(s => s._id === stepId).completedAt = completedAt;
    }
    await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, user._id, { steps: newSteps });
    try {
      if (isStepCompleted) {
        await this.notifyCompletedStep(user, step, nextStep);
      }
    } catch (err) {
      Logger.error(err);

      return newSteps;
    }
    return newSteps;
  }

  /**
   * update date of email sent on unlocked steps.
   * @param user - The user to update
   * @param unlockedSteps - The list of steps to update
   */
  private async updateEmailSteps(user: WelcomeUser, unlockedSteps: string[]): Promise<void> {
    const unlockEmailSentAt = Timestamp.now();

    await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, user._id, {
      steps: user.steps.map(step => (unlockedSteps.includes(step._id) ? { ...step, unlockEmailSentAt } : step)),
    });
  }

  private async notifyCompletedStep(user: WelcomeUser, step: Step, nextStep: Step): Promise<void> {
    if (step.completionEmailManager !== undefined) {
      await this.mailService.sendStepMailToManager(user, step.completionEmailManager, step._id);
    }

    if (nextStep !== undefined && nextStep.unlockEmail !== undefined) {
      await this.mailService.scheduleMail(user, nextStep.unlockEmail, nextStep._id);
    }

    if (step.completionEmail !== undefined) {
      await this.mailService.sendStepMail(user, step.completionEmail, "completion");
    }
  }

  private async createDbUser(createUserDto: CreateUserDto): Promise<WelcomeUser> {
    const now = Timestamp.now();

    const steps = await this.stepService.generateSteps(
      new Date(createUserDto.signupDate),
      new Date(createUserDto.arrivalDate),
    );

    const dbUser = Object.assign(instanceToPlain(createUserDto), {
      steps: steps.map(s => ({
        _id: s.step._id,
        unlockDate: Timestamp.fromDate(s.dt),
        subStepsCompleted: 0,
      })),
      creationDate: now,
      lastUpdate: now,
    });

    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_USERS, dbUser);
  }

  private mapCreateUserDtoToWelcomeUser(createUserDto: CreateUserDto): WelcomeUser {
    const welcomeUser = new WelcomeUser();
    welcomeUser.email = createUserDto.email;
    welcomeUser.firstName = createUserDto.firstName;
    welcomeUser.lastName = createUserDto.lastName;
    welcomeUser.hrReferent = {
      firstName: createUserDto.hrReferent.firstName,
      lastName: createUserDto.hrReferent.lastName,
      email: createUserDto.hrReferent.email,
    };

    return welcomeUser;
  }
}