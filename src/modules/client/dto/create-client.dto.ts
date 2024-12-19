import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateClientDto {
  @ApiProperty({
    description: "SIREN of the client.",
    example: "123456789",
  })
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty({
    description: "Client name.",
    example: "Company X",
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: "Static path of the logo.",
    example: "images/clients/123456789.png",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public logoStaticPath?: string;

  @ApiProperty({
    description: "Client line of business.",
    example: "Retail",
  })
  @IsString()
  @IsNotEmpty()
  public sector: string;

  @ApiProperty({
    description: "Country or countries where the client operate.",
    example: "France",
  })
  @IsString()
  @IsNotEmpty()
  public country: string;

  @ApiProperty({
    description: "Number of employees (approximately).",
    example: 1200,
  })
  @IsNumber()
  public numberOfEmployees: number;
}