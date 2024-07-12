import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { EMAIL_FROM, STEP_EMAIL_SUBJECT, STEP_EMAIL_TEXT } from './constants';
import { Filter, Timestamp } from '@google-cloud/firestore';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '@modules/shared/firestore/constants';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly logger: Logger,
  ) {
    if (process.env.EMAIL_SERVICE) {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
      });
    }
  }

  sendEmail(
    user: WelcomeUser,
    subject: nodemailer.SendMailOptions['subject'],
    text: nodemailer.SendMailOptions['text'],
  ) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        {
          from: EMAIL_FROM,
          to: user.email,
          subject,
          text,
        },
        (error, email) => {
          if (error) {
            return reject({ _id: user._id, error: error.message });
          }
          if (!process.env.EMAIL_SERVICE) {
            this.logger.log({ email });
          }
          return resolve({ _id: user._id });
        },
      );
    });
  }

  async getNewcomers() {
    return await this.firestoreService.getAllDocuments<WelcomeUser>(
      FIRESTORE_COLLECTIONS.welcomeUsers,
      Filter.where('arrivalDate', '>', new Date().toISOString()),
    );
  }

  async updateSteps(user: WelcomeUser, unlockedSteps: number[]) {
    const emailSentAt = Timestamp.now();
    return await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.welcomeUsers, user._id, {
      steps: user.steps.map((step) => (unlockedSteps.includes(step._id) ? Object.assign(step, { emailSentAt }) : step)),
    });
  }

  /**
   * Get all of the newly unlocked steps
   * @param {WelcomeUser} user The user
   * @return {number[]} List of unlocked steps
   */
  getNewlyUnlockedSteps(user: WelcomeUser): number[] {
    const now = new Date();
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
