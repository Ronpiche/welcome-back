import { CreateMemberDto } from '@src/modules/members/dto/create-member.dto';
import { OutputMembersDto } from '@src/modules/members/dto/output-members.dto';
import { Member } from '@src/modules/members/entities/member.entity';

export const OutputMembersDtoMock: OutputMembersDto = {
  _id: 'test-id',
  firstname: 'testFirstName',
  lastname: 'testLastName',
  gender: 'male',
  executiveCommittee: true,
  roles: [
    {
      scope: 'agency',
      subscope: 'Lille',
      role: 'BusinessOwner',
    },
  ],
};

export const MemberMock: Member = {
  _id: 'test-id',
  firstname: 'testFirstName',
  lastname: 'testLastName',
  gender: 'male',
  executiveCommittee: true,
  roles: [
    {
      scope: 'agency',
      subscope: 'Lille',
      role: 'BusinessOwner',
    },
  ],
};

export const createMemberMock: CreateMemberDto = {
  firstname: 'createFirstName',
  lastname: 'createLastName',
  gender: 'male',
  executiveCommittee: true,
  roles: [
    {
      scope: 'agency',
      subscope: 'Lille',
      role: 'BusinessOwner',
    },
  ],
};
