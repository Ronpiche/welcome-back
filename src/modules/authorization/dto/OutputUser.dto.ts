import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class OutputUserDto {
  @ApiProperty()
  @Expose()
  _id: string;
  @ApiProperty()
  @Expose()
  firstName: string;
  @ApiProperty()
  @Expose()
  lastName: string;
  @ApiProperty()
  @Expose()
  email: string;
  @ApiProperty()
  @Expose()
  hub: string;
  @ApiProperty()
  @Expose()
  welcome: string;
  @ApiProperty()
  @Expose()
  customPersmission: string[];
  @ApiProperty()
  @Exclude()
  createdAt: Timestamp;
  @ApiProperty()
  @Exclude()
  updatedAt: Timestamp;
}
