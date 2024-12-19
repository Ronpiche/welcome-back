import { ApiProperty } from "@nestjs/swagger";

export class Client {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public logoStaticPath?: string;

  @ApiProperty()
  public sector: string;

  @ApiProperty()
  public country: string;

  @ApiProperty()
  public numberOfEmployees: number;
}