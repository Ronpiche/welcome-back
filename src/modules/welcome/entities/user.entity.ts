import type { Timestamp } from "@google-cloud/firestore";

export class RhUserInfo {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;
}

export class UserSubStep {
  _id: string;

  isCompleted: boolean;
}

export class UserStep {
  _id: string;

  unlockDate: Timestamp;

  unlockEmailSentAt?: Timestamp;

  completedAt?: Timestamp;

  subStep: UserSubStep[];
}

export class WelcomeUser {
  constructor(partial: Partial<WelcomeUser>) {
    Object.assign(this, partial);
  }

  _id: string;

  email: string;

  note: string;

  signupDate: string;

  lastName: string;

  civility: string;

  agency: string;

  creationDate: Timestamp;

  referentRH: RhUserInfo;

  arrivalDate: string;

  firstName: string;

  lastUpdate: Timestamp;

  grade: string;

  practice: string;

  smileyQuestion?: string;

  steps: UserStep[];
}