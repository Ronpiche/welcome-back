import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Res,
  HttpStatus,
  Request,
} from "@nestjs/common";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { CreateUserDto } from "@modules/welcome/dto/input/create-user.dto";
import { UpdateUserDto } from "@modules/welcome/dto/input/update-user.dto";
import { WelcomeUserDto } from "@modules/welcome/dto/output/welcome-user.dto";
import {
  ApiBearerAuth,
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
import { instanceToPlain, plainToInstance } from "class-transformer";
import { WelcomeUser } from "@modules/welcome/entities/user.entity";
import { EmailRunKO, EmailRunOK } from "@modules/welcome/dto/output/email-run.dto";
import { WelcomeStepDto } from "@modules/welcome/dto/output/welcome-step.dto";
import { Response } from "express";
import { Role, Roles } from "@src/decorators/role";
import { UserRequest } from "@src/guards/jwt.guard";

@ApiTags("welcome")
@Controller("welcome")
@ApiBearerAuth()
export class WelcomeController {
  public constructor(private readonly welcomeService: WelcomeService) { }

  @Post("users")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create an user", description: "Returns new user." })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: "User created", type: WelcomeUserDto })
  public async create(@Body() createUserDto: CreateUserDto): Promise<WelcomeUserDto> {
    const user: WelcomeUser = await this.welcomeService.createUser(createUserDto);

    return plainToInstance(WelcomeUserDto, instanceToPlain(user), { excludeExtraneousValues: true });
  }

  @Get("users")
  @Roles(Role.ADMIN)
  @ApiQuery({
    name: "arrivalDateStart",
    type: Date,
    required: false,
    example: new Date().toISOString().substring(0, 10),
  })
  @ApiQuery({
    name: "arrivalDateEnd",
    type: Date,
    required: false,
    example: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().substring(0, 10),
  })
  @ApiOperation({ summary: "Find all users", description: "Returns all users." })
  @ApiOkResponse({ description: "OK", type: [WelcomeUserDto] })
  public async findAll(@Query("arrivalDateStart") arrivalDateStart?: Date, @Query("arrivalDateEnd") arrivalDateEnd?: Date): Promise<WelcomeUserDto[]> {
    const users: WelcomeUser[] = await this.welcomeService.findAll(arrivalDateStart, arrivalDateEnd);

    return users.map(user => plainToInstance(WelcomeUserDto, instanceToPlain(user), { excludeExtraneousValues: true }));
  }

  @Get("users/me")
  @Roles(Role.USER)
  @ApiOperation({ summary: "Find my user", description: "Returns my user" })
  @ApiOkResponse({ description: "OK", type: WelcomeUserDto })
  public async findMe(@Request() { user }: UserRequest): Promise<WelcomeUserDto> {
    const myUser = await this.welcomeService.findOne(user.id);

    return plainToInstance(WelcomeUserDto, instanceToPlain(myUser), { excludeExtraneousValues: true });
  }

  @Get("users/:id")
  @Roles(Role.ADMIN)
  @ApiParam({ name: "id", type: String, required: false, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiOperation({ summary: "Find one user", description: "Returns one user" })
  @ApiOkResponse({ description: "OK", type: WelcomeUserDto })
  public async findOne(@Param("id") id: string): Promise<WelcomeUserDto> {
    const user = await this.welcomeService.findOne(id);

    return plainToInstance(WelcomeUserDto, instanceToPlain(user), { excludeExtraneousValues: true });
  }

  @Delete("users/:id")
  @Roles(Role.ADMIN)
  @ApiParam({ name: "id", type: String, required: false, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiOperation({ summary: "Remove one user", description: "Remove user" })
  @ApiOkResponse({ description: "User deleted" })
  public async remove(@Param("id") id: string): Promise<void> {
    await this.welcomeService.remove(id);
  }

  @Put("users/me")
  @Roles(Role.USER)
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Update my user", description: "Update my user" })
  @ApiOkResponse({ description: "OK", type: WelcomeUserDto })
  public async updateMe(@Request() { user }: UserRequest, @Body() updateUserDto: UpdateUserDto): Promise<WelcomeUserDto> {
    const myUser = await this.welcomeService.update(user.id, updateUserDto);

    return plainToInstance(WelcomeUserDto, instanceToPlain(myUser), {
      excludeExtraneousValues: true,
    });
  }

  @Put("users/:id")
  @Roles(Role.ADMIN)
  @ApiParam({ name: "id", type: String, required: false, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Update One User", description: "Update user" })
  @ApiOkResponse({ description: "OK", type: WelcomeUserDto })
  public async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<WelcomeUserDto> {
    const user = await this.welcomeService.update(id, updateUserDto);

    return plainToInstance(WelcomeUserDto, instanceToPlain(user), {
      excludeExtraneousValues: true,
    });
  }

  @Post("run")
  @Roles(Role.ADMIN)
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
  public async run(@Res({ passthrough: true }) response: Response): Promise<PromiseSettledResult<{ _id: WelcomeUser["_id"] }>[]> {
    const results = await this.welcomeService.run(new Date());
    if (results.some(result => result.status === "rejected")) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return results;
  }

  @Post("users/me/steps/:stepId")
  @Roles(Role.USER)
  @ApiParam({ name: "stepId", type: String, example: "1" })
  @ApiOperation({
    summary: "Complete my user sub step",
  })
  @ApiCreatedResponse({ description: "Sub step completed", type: WelcomeStepDto, isArray: true })
  public async incrementMySubStep(@Request() { user }: UserRequest, @Param("stepId") stepId: string): Promise<WelcomeStepDto[]> {
    const steps = await this.welcomeService.incrementSubStep(user.id, stepId);

    return steps.map(step => plainToInstance(WelcomeStepDto, instanceToPlain(step), { excludeExtraneousValues: true }));
  }

  @Post("users/:userId/steps/:stepId")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Complete an user sub step",
  })
  @ApiCreatedResponse({ description: "Sub step completed", type: WelcomeStepDto, isArray: true })
  public async incrementSubStep(@Param("userId") userId: string, @Param("stepId") stepId: string): Promise<WelcomeStepDto[]> {
    const steps = await this.welcomeService.incrementSubStep(userId, stepId);

    return steps.map(step => plainToInstance(WelcomeStepDto, instanceToPlain(step), { excludeExtraneousValues: true }));
  }
}