import { Practice } from "@modules/welcome/types/user.enum";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { HrReferentDto } from "@modules/welcome/dto/input/hr-referent.dto";

export class CreateUserDto {
  @ApiProperty({ example: "john.doe@127.0.0.1" })
  // @IsEmail() TODO: Uncomment this when production ready
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty({ example: new Date().toISOString().substring(0, 10) })
  @IsNotEmpty()
  public signupDate: string;

  @ApiProperty({ example: new Date(new Date().setDate(new Date().getDate() + 75)).toISOString().substring(0, 10) })
  @IsNotEmpty()
  public arrivalDate: string;

  @ApiProperty({ isArray: true, enum: Practice, enumName: "Practice" })
  @IsArray()
  public practices: Practice[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => HrReferentDto)
  public hrReferent: HrReferentDto;

  @ApiProperty({ example: "Lille" })
  @IsString()
  @IsNotEmpty()
  public agency: string;

  @ApiProperty({ example: "Example user" })
  @IsString()
  public note: string;
}