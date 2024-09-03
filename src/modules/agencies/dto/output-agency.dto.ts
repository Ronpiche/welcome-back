import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OutputAgencyDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  coordinates: Array<number>;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  creationYear: number;

  @ApiProperty()
  @Expose()
  services: Array<string>;

  @ApiProperty()
  @Expose()
  customers: Array<string>;

  @ApiProperty()
  @Expose()
  goodPlaces: Array<string>;
}
