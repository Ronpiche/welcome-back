import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class HrReferentDto {
  @ApiProperty({ example: "abcd-1234" })
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty({ example: "Joe" })
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty({ example: "Bloggs" })
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty({ example: "joe.bloggs@127.0.0.1" })
  // @IsEmail() TODO: Uncomment this when production ready
  @IsNotEmpty()
  public email: string;
}