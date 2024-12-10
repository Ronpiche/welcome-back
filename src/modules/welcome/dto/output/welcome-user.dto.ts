import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { Timestamp } from "@google-cloud/firestore";
import { Practice } from "@modules/welcome/types/user.enum";
import { WelcomeStepDto } from "@modules/welcome/dto/output/welcome-step.dto";

export class WelcomeUserDto {
  @ApiProperty()
  @Expose()
  public _id: string;

  @ApiProperty()
  @Expose()
  public note: string;

  @ApiProperty()
  @Expose()
  public signupDate: string;

  @ApiProperty()
  @Expose()
  public lastName: string;

  @ApiProperty()
  @Expose()
  public agency: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  public creationDate: Date;

  @ApiProperty()
  @Expose()
  public hrReferent: string;

  @ApiProperty()
  @Expose()
  public arrivalDate: string;

  @ApiProperty()
  @Expose()
  public firstName: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value?._seconds ? new Timestamp(value._seconds, value._nanoseconds).toDate() : value))
  public lastUpdate: Date;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty({ isArray: true, enum: Practice, enumName: "Practice" })
  @Expose()
  public practices: Practice[];

  @ApiProperty()
  @Expose()
  @Type(() => WelcomeStepDto)
  public steps: WelcomeStepDto[];
}