import { Timestamp } from '@google-cloud/firestore';

export class WelcomeStep {
  _id: number;
  unlockDate: Timestamp;
  emailSentAt?: Timestamp;
  completedAt?: Timestamp;
}
