import { Timestamp } from "@google-cloud/firestore";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class OutputRoleDto {
  @ApiProperty()
  @Expose()
  app: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  rules: string[];

  @ApiProperty()
  @Expose()
  createdAt: Timestamp;

  @ApiProperty()
  @Expose()
  updatedAt: Timestamp;
}