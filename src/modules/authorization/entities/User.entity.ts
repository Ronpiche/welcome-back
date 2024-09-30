import type { Timestamp } from "@google-cloud/firestore";

export class User {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;

  hub: string;

  welcome: string;

  customPersmission: string[];

  createdAt: Timestamp;

  updatedAt: Timestamp;
}