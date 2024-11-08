import { PartialType } from "@nestjs/swagger";
import { CreateAgencyDto } from "@modules/agencies/dto/create-agency.dto";

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {}