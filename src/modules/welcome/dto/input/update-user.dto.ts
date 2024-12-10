import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "@modules/welcome/dto/input/create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) { }