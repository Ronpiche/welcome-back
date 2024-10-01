import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class OutputAgencyDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  coordinates: number[];

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  creationYear: number;

  @ApiProperty()
  @Expose()
  services: string[];

  @ApiProperty()
  @Expose()
  customers: string[];

  @ApiProperty()
  @Expose()
  goodPlaces: string[];
}