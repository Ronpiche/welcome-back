import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class OutputAgencyDto {
  @ApiProperty()
  @Expose()
  public _id: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Expose()
  public coordinates: number[];

  @ApiProperty()
  @Expose()
  public address: string;

  @ApiProperty()
  @Expose()
  public creationYear: number;

  @ApiProperty()
  @Expose()
  public services: string[];

  @ApiProperty()
  @Expose()
  public customers: string[];

  @ApiProperty()
  @Expose()
  public goodPlaces: string[];
}