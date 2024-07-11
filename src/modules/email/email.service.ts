import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EMAIL_FROM, STEP_EMAIL_SUBJECT, STEP_EMAIL_TEXT } from './constants';
import { Filter, Timestamp } from '@google-cloud/firestore';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { FIRESTORE_COLLECTIONS } from '@modules/shared/firestore/constants';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';

@Injectable()
export class EmailService {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly logger: Logger,
  ) {}

  sendEmail(
    to: nodemailer.SendMailOptions['to'],
    subject: nodemailer.SendMailOptions['subject'],
    text: nodemailer.SendMailOptions['text'],
  ) {
    this.logger.log({ to, subject, text });
    if (process.env.EMAIL_SERVICE) {
      // TODO: Change this
      return this.transporter.sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        text,
      });
    }
    return Promise.resolve();
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
    const users = await this.firestoreService.getAllDocuments<WelcomeUser>(
      FIRESTORE_COLLECTIONS.welcomeUsers,
      Filter.where('arrivalDate', '>', new Date().toISOString()),
    );
    const userEmails = [];
    users.forEach((user) => {
      const unlockedSteps = this.getNewlyUnlockedSteps(user);
      if (unlockedSteps.length > 0) {
        userEmails.push(
          new Promise((resolve, reject) => {
            this.sendEmail(
              user.email,
              STEP_EMAIL_SUBJECT,
              STEP_EMAIL_TEXT.replaceAll('{USER}', user.firstName).replaceAll(
                '{STEP}',
                unlockedSteps.map((s) => s + 1).join(' ,'),
              ),
            )
              .then(async (response) => {
                user.steps.forEach((step) => {
                  if (unlockedSteps.includes(step._id)) {
                    step.emailSentAt = Timestamp.now();
                  }
                });
                await this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.welcomeUsers, user._id, {
                  steps: user.steps,
                });
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
