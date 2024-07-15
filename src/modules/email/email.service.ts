import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { STEP_EMAIL_SUBJECT, STEP_EMAIL_TEXT } from './constants';
import { Filter, Timestamp } from '@google-cloud/firestore';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '@modules/shared/firestore/constants';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';

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
      throw { _id: user._id, error: e.message };
    }
  }

  /**
   * Get the list of newcomers (where arrival date is in the future).
   * @return The list of newcomers
   */
  async getNewcomers() {
    return await this.firestoreService.getAllDocuments<WelcomeUser>(
      FIRESTORE_COLLECTIONS.welcomeUsers,
      Filter.where('arrivalDate', '>', new Date().toISOString()),
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
   * @return The list of unlocked steps
   */
  getNewlyUnlockedSteps(user: WelcomeUser): number[] {
    if (!user.steps) {
      return [];
    }
    const now = new Date();
    return user.steps.reduce((acc, step) => {
      if (!step.emailSentAt && step.unlockDate.toDate() <= now) {
        acc.push(step._id);
      }
      return acc;
    }, []);
  }

  /**
   * Launch a task that search all of the newcomers and send them an email if they have unloked a step.
   * @return List of unlocked steps
   */
  async run() {
    this.logger.log('[Email] - send email to users');
    const userEmails = [];
    (await this.getNewcomers()).forEach((user) => {
      const unlockedSteps = this.getNewlyUnlockedSteps(user);
      if (unlockedSteps.length > 0) {
        userEmails.push(
          new Promise((resolve, reject) => {
            this.sendEmail(
              user,
              STEP_EMAIL_SUBJECT,
              STEP_EMAIL_TEXT.replaceAll('{USER}', user.firstName).replaceAll(
                '{STEP}',
                unlockedSteps.map((s) => s + 1).join(', '),
              ),
            )
              .then(async (response) => {
                await this.updateSteps(user, unlockedSteps);
                resolve(response);
              })
              .catch(reject);
          }),
        );
      }
    });
    return await Promise.allSettled(userEmails);
  }
}
