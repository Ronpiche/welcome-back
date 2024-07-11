import { Timestamp } from '@google-cloud/firestore';
import { WelcomeStep } from './step.entity';

export class WelcomeUser {
  _id: string;
  email: string;
  appGames: object;
  note: string;
  signupDate: string;
  lastName: string;
  civility: string;
  agency: string;
  personnalProject: string;
  hiringProcessEvaluation: string;
  creationDate: Timestamp;
  referentRH: object;
  arrivalDate: string;
  firstName: string;
  satisfactionQuestions: Record<string, string>;
  lastUpdate: Timestamp;
  communitiesQuestions: Record<string, string>;
  grade: string;
  practice: string;
  steps: WelcomeStep[];
}
