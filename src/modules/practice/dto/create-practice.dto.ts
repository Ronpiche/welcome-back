import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { PracticeVideoDto } from "@modules/practice/dto/practice-video.dto";
import { PracticeFeedbackDto } from "@modules/practice/dto/practice-feedback.dto";

export class CreatePracticeDto {
  @ApiProperty({
    description: "Name of the practice.",
    example: "Product",
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: "Short description of the practice.",
  })
  @IsString()
  @IsNotEmpty()
  public summary: string;

  @ApiProperty({
    description: "List of tags.",
    example: ["Innovation", "Collaboration"],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  public tags: string[];

  @ApiProperty({
    description: "Detailed description of the practice.",
  })
  @IsString()
  @IsNotEmpty()
  public description: string;

  @ApiProperty({
    description: "List of jobs assigned to the practice.",
    example: ["Business PO", "Agile Master"],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  public jobs: string[];

  @ApiProperty({
    description: "List of videos about the practice.",
    type: [PracticeVideoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PracticeVideoDto)
  public videos: PracticeVideoDto[];
  
  @ApiProperty({
    description: "A client feedback about the practice.",
    type: PracticeFeedbackDto,
  })
  @ValidateNested()
  @Type(() => PracticeFeedbackDto)
  public feedback: PracticeFeedbackDto;
}