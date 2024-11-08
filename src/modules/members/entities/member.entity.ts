class RoleMember {
  public scope: string;

  public subscope?: string;

  public role: string;
}

export class Member {
  public _id: string;

  public firstname: string;

  public lastname: string;

  public gender: "male" | "female";

  public executiveCommittee: boolean;

  public roles: RoleMember[];
}