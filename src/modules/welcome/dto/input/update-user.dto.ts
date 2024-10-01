import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class WelcomeSubStepInputDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  _id: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;
}

class WelcomeStepInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unlockDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  emailSentAt?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  completedAt?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => WelcomeSubStepInputDto)
  subStep: WelcomeSubStepInputDto[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @ValidateNested()
  @Type(() => WelcomeStepInputDto)
  @IsOptional()
  steps?: WelcomeStepInputDto[];
}