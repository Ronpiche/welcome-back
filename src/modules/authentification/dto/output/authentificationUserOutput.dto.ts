import { ApiProperty } from '@nestjs/swagger';
import { WelcomeUserDto } from '@src/modules/welcome/dto/output/welcome-user.dto';
import { Expose, Type } from 'class-transformer';

export class GipUser {
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

export class AuthentificationUserOutputDto {
  @ApiProperty()
  @Expose()
  @Type(() => GipUser)
  gipUser: GipUser;

  @ApiProperty()
  @Expose()
  @Type(() => WelcomeUserDto)
  welcomeUser: WelcomeUserDto;
}
