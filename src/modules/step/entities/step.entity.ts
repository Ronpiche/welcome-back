import { ApiProperty } from "@nestjs/swagger";
import { StepEmail } from "@modules/step/entities/step-email.entity";

export class Step {
  @ApiProperty()
  public _id: string;

  @ApiProperty({ description: "Where the step start between creation date and arrival date. Value between 0 (0%) and 1 (100%)." })
  public cutAt: number;

  @ApiProperty({
    example: 90,
    description:
      "Max number of days between creation date and arrival date where the step cutting is applied. If the number of days exeeds this value, the computation will be adjusted.",
  })
  public maxDays: number;

  @ApiProperty({
    example: 30,
    description:
      "Min number of days between creation date and arrival date where the step cutting is applied. If the number of days is under this value, the cut will be forced at 0%.",
  })
  public minDays: number;

  @ApiProperty({
    type: StepEmail,
    description: "Email sent to the user when a step is unlocked.",
  })
  public unlockEmail?: StepEmail;

  @ApiProperty({
    type: StepEmail,
    description: "Email sent to the user when a step is completed.",
  })
  public completionEmail?: StepEmail;

  @ApiProperty({
    type: StepEmail,
    description: "Email sent to the user's manager when a step is completed.",
  })
  public completionEmailManager?: StepEmail;

  @ApiProperty({
    example: 4,
    description: "Number of sub steps",
  })
  public subSteps: number;
}