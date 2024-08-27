import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserOutputDto {
  @ApiProperty()
  @Expose()
  uid: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;
}
