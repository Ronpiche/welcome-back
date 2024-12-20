import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PracticeVideoDto {
  @ApiProperty({
    description: "Id of the member that is video author.",
  })
  @IsString()
  @IsNotEmpty()
  public member: string;

  @ApiProperty({
    description: "Url of the video.",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public url?: string;

  @ApiProperty({
    description: "Quote from the member about the video.",
  })
  @IsString()
  @IsNotEmpty()
  public quote: string;
}