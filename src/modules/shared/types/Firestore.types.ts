import { WelcomeUser } from '@/modules/welcome/entities/user.entity';
import { CreateUpdateRoleDto } from '@/modules/authorization/dto/create-role.dto';
import { UserDto } from '@modules/authorization/dto/authorization.dto';

export interface Role {
  _id?: string;
  __v?: string;
  app: string;
  name: string;
  rules: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

export type FirestoreDocumentType = CreateUpdateRoleDto | UserDto | WelcomeUser;

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
