import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateAgencyDto {
  @ApiProperty({ example: "Lille" })
  @IsString()
  name: string;

  @ApiProperty({ example: [2.34, 48.88] })
  @IsArray()
  coordinates: number[];

  @ApiProperty({ example: "1 rue de Lille" })
  @IsString()
  address: string;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  creationYear: number;

  @ApiProperty({ example: ["kitchen"] })
  @IsArray()
  services: string[];

  @ApiProperty({ example: ["Daveo"] })
  @IsArray()
  customers: string[];

  @ApiProperty({ example: ["McDo"] })
  @IsArray()
  goodPlaces: string[];
}