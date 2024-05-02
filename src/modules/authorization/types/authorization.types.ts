export interface Role {
  _id: string;
  app: string;
  name: string;
  __v: string;
  rules: string[];
  createdAt: string;
  updatedAt: string;
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

export type UserRole = keyof typeof UserRoles;

export type FilterType = {
  app?: string;
  name?: string;
};
