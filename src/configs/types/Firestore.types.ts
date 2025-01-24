import type { WelcomeUser } from "@modules/welcome/entities/user.entity";
import type { User } from "@modules/authorization/entities/User.entity";
import type { Role } from "@modules/authorization/entities/Role.entity";
import type { ContentEntity } from "@modules/content/entities/content.entity";
import type { DocumentData } from "@google-cloud/firestore";
import type { Step } from "@modules/step/entities/step.entity";
import type { Agency } from "@src/modules/agencies/entities/agency.entity";
import type { Member } from "@src/modules/members/entities/member.entity";

export enum UserRoles {
  Admin = "Admin",
  Collaborateur = "Collaborateur",
  TalentManager = "Talent Manager",
  BusinessManager = "Business Manager",
  DirecteurAgence = "Directeur Agence",
  Consultant = "Consultant",
  LeaderCommunauté = "Leader Communauté",
  FinancesEtOpérations = "Finances et Opérations",
}

export enum FIRESTORE_COLLECTIONS {
  ROLES = "AuthorizationDatabase_roles",
  AUTHORIZED_USERS = "AuthorizationDatabase_users",
  CLIENTS = "WelcomeDatabase_clients",
  FEEDBACKS = "WelcomeDatabase_feedbacks",
  FEEDBACKS_QUESTIONS = "Feedback_questions",
  FEEDBACKS_ANSWERS = "Feedback_answers",
  QUIZZES = "WelcomeDatabase_quizzes",
  STEPS = "WelcomeDatabase_steps",
  PRACTICES = "WelcomeDatabase_practices",
  WELCOME_USERS = "WelcomeDatabase_users",
  WELCOME_CONTENT = "WelcomeDatabase_content",
  WELCOME_AGENCIES = "WelcomeDatabase_agencies",
  WELCOME_MEMBERS = "WelcomeDatabase_members",
}

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
};

export type FirestoreDocumentType = WelcomeUser | User | Role | ContentEntity | DocumentData | Step | Agency | Member;

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