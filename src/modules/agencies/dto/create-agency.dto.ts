import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateAgencyDto {
  @ApiProperty({ example: "Lille" })
  @IsString()
  public name: string;

  @ApiProperty({ example: [2.34, 48.88] })
  @IsArray()
  public coordinates: number[];

  @ApiProperty({ example: "1 rue de Lille" })
  @IsString()
  public address: string;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  public creationYear: number;

  @ApiProperty({ example: ["kitchen"] })
  @IsArray()
  public services: string[];

  @ApiProperty({ example: ["Daveo"] })
  @IsArray()
  public customers: string[];

  @ApiProperty({ example: ["McDo"] })
  @IsArray()
  public goodPlaces: string[];
}