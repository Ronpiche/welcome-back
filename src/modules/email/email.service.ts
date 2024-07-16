import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { STEP_EMAIL_SUBJECT, WELCOME_EMAIL_SUBJECT } from './constants';
import { stepTemplate, welcomeTemplate } from './templates';
import { Filter, Timestamp } from '@google-cloud/firestore';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '@modules/shared/firestore/constants';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';

const FIRST_STEP_ID = 0;

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly firestoreService: FirestoreService,
    private readonly logger: Logger,
  ) {}

  /**
   * Send an email.
   * @param user - The receiver
   * @param subject - The subject of the email
   * @param html - The HTML of the email
   * @return The success/failure of the email sending
   */
  async sendEmail(user: WelcomeUser, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({ to: user.email, subject, html });
      return { _id: user._id };
    } catch (e) {
      e._id = user._id;
      throw e;
    }
  }

  /**
   * Get the list of newcomers (where arrival date is in the future).
   * @param now - The actual date
   * @return The list of newcomers
   */
  async getNewcomers(now: Date) {
    return await this.firestoreService.getAllDocuments<WelcomeUser>(
      FIRESTORE_COLLECTIONS.welcomeUsers,
      Filter.where('arrivalDate', '>', now.toISOString()),
    );
  }

  /**
   * Update date of email sent on unlocked steps.
   * @param user - The user to update
   * @param unlockedSteps - The list of steps to update
   * @return The database result
   */
  async updateSteps(user: WelcomeUser, unlockedSteps: number[]) {
    const emailSentAt = Timestamp.now();
    return await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.welcomeUsers, user._id, {
      steps: user.steps.map((step) => (unlockedSteps.includes(step._id) ? Object.assign(step, { emailSentAt }) : step)),
    });
  }

  /**
   * Get all of the newly unlocked steps.
   * @param user - The user to check
   * @param now - The actual date
   * @return The list of unlocked steps
   */
  getNewlyUnlockedSteps(user: WelcomeUser, now: Date): number[] {
    if (!user.steps) {
      return [];
    }
    return user.steps.reduce((acc, step) => {
      if (!step.emailSentAt && step.unlockDate.toDate() <= now) {
        acc.push(step._id);
      }
      return acc;
    }, []);
  }

  /**
   * Launch a task that search all of the newcomers and send them an email if they have unloked a step.
   * @param now - The actual date
   * @return List of unlocked steps
   */
  async run(now: Date) {
    this.logger.log('[Email] - send email to users');
    const userEmails = [];
    (await this.getNewcomers(now)).forEach((user) => {
      const unlockedSteps = this.getNewlyUnlockedSteps(user, now);
      if (unlockedSteps.length > 0) {
        userEmails.push(
          new Promise((resolve, reject) => {
            const isNew = unlockedSteps.includes(FIRST_STEP_ID);
            const subject = isNew ? WELCOME_EMAIL_SUBJECT : STEP_EMAIL_SUBJECT;
            const html = isNew ? welcomeTemplate(user, unlockedSteps) : stepTemplate(user, unlockedSteps);
            this.sendEmail(user, subject, html)
              .then(async (response) => {
                await this.updateSteps(user, unlockedSteps);
                resolve(response);
              })
              .catch(({ _id, message }) => reject({ _id, message }));
          }),
        );
      }
    });
    return await Promise.allSettled(userEmails);
  }
}
