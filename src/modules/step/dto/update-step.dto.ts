import { PartialType } from "@nestjs/swagger";
import { CreateStepDto } from "@src/modules/step/dto/create-step.dto";

export class UpdateStepDto extends PartialType(CreateStepDto) {}