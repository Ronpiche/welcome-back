import { Timestamp } from '@google-cloud/firestore';

export class Role {
  _id: string;
  app: string;
  name: string;
  rules: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
