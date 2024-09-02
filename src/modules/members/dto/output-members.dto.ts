import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class OutputRoleMembersDto {
  @ApiProperty()
  @Expose()
  scope: string;

  @ApiProperty()
  @Expose()
  subscope?: string;

  @ApiProperty()
  @Expose()
  role: string;
}

export class OutputMembersDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  firstname: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  gender: 'male' | 'female';

  @ApiProperty()
  @Expose()
  executiveCommittee: boolean;

  @ApiProperty()
  @Expose()
  roles: OutputRoleMembersDto[];
}
