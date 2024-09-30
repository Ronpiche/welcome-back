import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

class SubStepDto {
  @ApiProperty({ example: "1" })
  @IsString()
  @IsOptional()
  _id: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;
}

class EmailDto {
  @ApiProperty({ example: "New step available" })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: "Hello, you have unlocked a new step." })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    example: 0.5,
    description: "Where the step start between creation date and arrival date. Value between 0 (0%) and 1 (100%).",
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  cutAt: number;

  @ApiProperty({
    example: 90,
    description:
      "Max number of days between creation date and arrival date where the step cutting is applied. If the number of days exeeds this value, the computation will be adjusted.",
  })
  @IsNumber()
  @Min(0)
  maxDays: number;

  @ApiProperty({
    example: 30,
    description:
      "Min number of days between creation date and arrival date where the step cutting is applied. If the number of days is under this value, the cut will be forced at 0%.",
  })
  @IsNumber()
  @Min(0)
  minDays: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => EmailDto)
  unlockEmail?: EmailDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => EmailDto)
  completionEmail?: EmailDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => EmailDto)
  completionEmailManager?: EmailDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SubStepDto)
  subStep: SubStepDto[];
}