import { PartialType } from "@nestjs/swagger";
import { CreatePracticeDto } from "@modules/practice/dto/create-practice.dto";

export class UpdatePracticeDto extends PartialType(CreatePracticeDto) {}