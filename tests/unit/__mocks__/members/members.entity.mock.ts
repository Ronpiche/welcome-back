import type { CreateMemberDto } from "@src/modules/members/dto/create-member.dto";
import type { OutputMembersDto } from "@src/modules/members/dto/output-member.dto";
import type { Member } from "@src/modules/members/entities/member.entity";

export const OutputMembersDtoMock: OutputMembersDto = {
  _id: "test-id",
  firstName: "testFirstName",
  lastName: "testLastName",
  email: "t.t@localhost",
  gender: "male",
  isExecutiveCommittee: true,
  roles: [
    {
      scope: "agency",
      subscope: "Lille",
      role: "BusinessOwner",
    },
  ],
};

export const MemberMock: Member = {
  _id: "test-id",
  firstName: "testFirstName",
  lastName: "testLastName",
  email: "t.t@localhost",
  gender: "male",
  isExecutiveCommittee: true,
  roles: [
    {
      scope: "agency",
      subscope: "Lille",
      role: "BusinessOwner",
    },
  ],
};

export const createMemberMock: CreateMemberDto = {
  firstName: "createFirstName",
  lastName: "createLastName",
  email: "t.t@localhost",
  gender: "male",
  isExecutiveCommittee: true,
  roles: [
    {
      scope: "agency",
      subscope: "Lille",
      role: "BusinessOwner",
    },
  ],
};