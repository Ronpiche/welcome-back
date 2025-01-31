import type { WelcomeUser } from "@modules/welcome/entities/user.entity";
import type { DocumentData } from "@google-cloud/firestore";
import type { Step } from "@modules/step/entities/step.entity";
import type { Agency } from "@src/modules/agencies/entities/agency.entity";
import type { Member } from "@src/modules/members/entities/member.entity";

export enum FIRESTORE_COLLECTIONS {
  CLIENTS = "WelcomeDatabase_clients",
  FEEDBACKS = "WelcomeDatabase_feedbacks",
  FEEDBACKS_QUESTIONS = "Feedback_questions",
  FEEDBACKS_ANSWERS = "Feedback_answers",
  QUIZZES = "WelcomeDatabase_quizzes",
  STEPS = "WelcomeDatabase_steps",
  PRACTICES = "WelcomeDatabase_practices",
  WELCOME_USERS = "WelcomeDatabase_users",
  WELCOME_AGENCIES = "WelcomeDatabase_agencies",
  WELCOME_MEMBERS = "WelcomeDatabase_members",
}

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
};

export type FirestoreDocumentType = WelcomeUser | DocumentData | Step | Agency | Member;

export enum FirestoreErrorCode {
  OK = 0,
  CANCELLED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  UNAUTHENTICATED = 16,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
}