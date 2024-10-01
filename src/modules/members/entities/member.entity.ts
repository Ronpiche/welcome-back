class RoleMember {
  scope: string;

  subscope?: string;

  role: string;
}

export class Member {
  _id: string;

  firstname: string;

  lastname: string;

  gender: "male" | "female";

  executiveCommittee: boolean;

  roles: RoleMember[];
}