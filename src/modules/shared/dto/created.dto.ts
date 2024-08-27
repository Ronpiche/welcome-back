import { ApiProperty } from '@nestjs/swagger';

export class CreatedDto {
  @ApiProperty()
  status: 'OK';

  @ApiProperty()
  id: string;
}
