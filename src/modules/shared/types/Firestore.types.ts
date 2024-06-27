import { WelcomeUser } from '@/modules/welcome/entities/user.entity';
import { User } from '@/modules/authorization/entities/User.entity';
import { Role } from '@/modules/authorization/entities/Role.entity';

export enum UserRoles {
  Admin = 'Admin',
  Collaborateur = 'Collaborateur',
  TalentManager = 'Talent Manager',
  BusinessManager = 'Business Manager',
  DirecteurAgence = 'Directeur Agence',
  Consultant = 'Consultant',
  LeaderCommunauté = 'Leader Communauté',
  FinancesEtOpérations = 'Finances et Opérations',
}

export type FirestoreDocumentType = WelcomeUser | User | Role;

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

export type ServiceAccount = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
};
