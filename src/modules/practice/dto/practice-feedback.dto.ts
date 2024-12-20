import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PracticeFeedbackDto {
  @ApiProperty({
    description: "SIREN of the client.",
  })
  @IsString()
  @IsNotEmpty()
  public client: string;

  @ApiProperty({
    description: "Description of benefits for the client.",
  })
  @IsString()
  @IsNotEmpty()
  public benefits: string;

  @ApiProperty({
    description: "Description od client context.",
  })
  @IsString()
  @IsNotEmpty()
  public context: string;

  @ApiProperty({
    description: "Description of the approach used for the client.",
  })
  @IsString()
  @IsNotEmpty()
  public ourApproach: string;
}