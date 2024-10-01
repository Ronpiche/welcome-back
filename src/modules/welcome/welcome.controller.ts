import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Put,
  Query,
  HttpCode,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { CreateUserDto } from "@modules/welcome/dto/input/create-user.dto";
import { UpdateUserDto } from "@modules/welcome/dto/input/update-user.dto";
import { WelcomeUserDto } from "@modules/welcome/dto/output/welcome-user.dto";
import { AccessGuard } from "@src/middleware/AuthGuard";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { FindAllUsersPipe } from "@modules/welcome/pipes/find-all-users.pipe";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { WelcomeUser } from "./entities/user.entity";
import { IsPublic } from "@src/decorators/isPublic";
import { EmailRunKO, EmailRunOK } from "./dto/output/email-run.dto";
import { Response } from "express";

@ApiTags("welcome")
@Controller("welcome")
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Post("users")
  @IsPublic(false)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: "Create User", description: "Returns new user." })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: "User created", type: WelcomeUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<WelcomeUserDto> {
    const user: WelcomeUser = await this.welcomeService.createUser(createUserDto);

    return plainToInstance(WelcomeUserDto, instanceToPlain(user), { excludeExtraneousValues: true });
  }

  @Get("users")
  @IsPublic(false)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiQuery({
    name: "arrivalDate[startDate]",
    type: Date,
    required: false,
    example: new Date().toISOString().substring(0, 10),
  })
  @ApiQuery({
    name: "arrivalDate[endDate]",
    type: Date,
    required: false,
    example: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().substring(0, 10),
  })
  @ApiOperation({ summary: "Find all users", description: "Returns all users." })
  @ApiOkResponse({ description: "OK", type: [WelcomeUserDto] })
  async findAll(@Query("arrivalDate", FindAllUsersPipe) filter: any): Promise<WelcomeUserDto[]> {
    const users: WelcomeUser[] = await this.welcomeService.findAll(filter);

    return users.map(user => plainToInstance(WelcomeUserDto, instanceToPlain(user), { excludeExtraneousValues: true }));
  }

  @Get("users/:id")
  @IsPublic(false)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiParam({ name: "id", type: String, required: false, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiOperation({ summary: "Find one user", description: "Returns one user" })
  @ApiOkResponse({ description: "OK", type: WelcomeUserDto })
  async findOne(@Param("id") id: string): Promise<WelcomeUserDto> {
    const user = await this.welcomeService.findOne(id);

    return plainToInstance(WelcomeUserDto, instanceToPlain(user), { excludeExtraneousValues: true });
  }

  @IsPublic(false)
  @Delete("users/:id")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiParam({ name: "id", type: String, required: false, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiOperation({ summary: "Remove one user", description: "Remove user" })
  @ApiOkResponse({ description: "User deleted" })
  async remove(@Param("id") id: string): Promise<string> {
    await this.welcomeService.remove(id);

    return "User deleted";
  }

  @Put("users/:id")
  @IsPublic(false)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiParam({ name: "id", type: String, required: false, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Update One User", description: "Update user" })
  @ApiOkResponse({ description: "OK", type: WelcomeUserDto })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<WelcomeUserDto> {
    const user = await this.welcomeService.update(id, updateUserDto);

    return plainToInstance(WelcomeUserDto, instanceToPlain(user), {
      excludeExtraneousValues: true,
    });
  }

  @Post("transform-property")
  @IsPublic(false)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(201)
  async transformAppGames(@Query("name") propertyName: string): Promise<{ status: string }> {
    return this.welcomeService.transformDbOjectStringsToArray(propertyName);
  }

  @Post("run")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: "Notify users by email",
    description:
      "Search users that have unlocked steps and send them an email. This method should be called by a CRON task.",
  })
  @ApiCreatedResponse({ description: "Users notified", type: EmailRunOK, isArray: true })
  @ApiExtraModels(EmailRunKO)
  @ApiInternalServerErrorResponse({
    description: "Error on user notification",
    schema: {
      type: "array",
      items: {
        oneOf: [{ $ref: getSchemaPath(EmailRunOK) }, { $ref: getSchemaPath(EmailRunKO) }],
      },
    },
  })
  async run(@Res({ passthrough: true }) response: Response) {
    const results = await this.welcomeService.run(new Date());
    if (results.some(result => result.status === "rejected")) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return results;
  }

  @Post("users/:userId/steps/:stepId")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: "Complete an user step",
  })
  async completeStep(@Param("userId") userId: string, @Param("stepId") stepId: string) {
    return this.welcomeService.completeStep(userId, stepId, new Date());
  }
}