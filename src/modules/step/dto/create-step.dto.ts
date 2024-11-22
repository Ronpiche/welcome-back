import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";
import { StepEmailDto } from "@modules/step/dto/step-email.dto";

export class CreateStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty({
    example: 0.5,
    description: "Where the step start between creation date and arrival date. Value between 0 (0%) and 1 (100%).",
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  public cutAt: number;

  @ApiProperty({
    example: 90,
    description:
      "Max number of days between creation date and arrival date where the step cutting is applied. If the number of days exeeds this value, the computation will be adjusted.",
  })
  @IsNumber()
  @Min(0)
  public maxDays: number;

  @ApiProperty({
    example: 30,
    description:
      "Min number of days between creation date and arrival date where the step cutting is applied. If the number of days is under this value, the cut will be forced at 0%.",
  })
  @IsNumber()
  @Min(0)
  public minDays: number;

  @ApiProperty({ description: "Email sent to the user when a step is unlocked." })
  @ValidateNested()
  @Type(() => StepEmailDto)
  public unlockEmail?: StepEmailDto;

  @ApiProperty({ description: "Email sent to the user when a step is completed." })
  @ValidateNested()
  @Type(() => StepEmailDto)
  public completionEmail?: StepEmailDto;

  @ApiProperty({ description: "Email sent to the user's manager when a step is completed." })
  @ValidateNested()
  @Type(() => StepEmailDto)
  public completionEmailManager?: StepEmailDto;

  @ApiProperty({
    example: 4,
    description: "Number of sub steps",
  })
  @IsNumber()
  public subSteps: number;
}