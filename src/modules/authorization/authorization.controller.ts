import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationService } from "./authorization.service";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FilterType } from "./types/authorization.types";
import { RoleDto, UserDto } from "./dto/authorization.dto";
import { CreateUpdateRoleDto } from "./dto/create-role.dto";
import { IsPublic } from "@src/decorators/isPublic";
import { AccessGuard } from "@src/middleware/AuthGuard";
import { plainToInstance } from "class-transformer";
import { OutputRoleDto } from "./dto/outputRole.dto";
import { OutputUserDto } from "./dto/OutputUser.dto";
import { User } from "./entities/User.entity";

@ApiTags("Authorization")
@ApiBearerAuth()
@Controller("authorization")
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: "app",
    description: "the filter option for the targetted app",
    required: false,
    example: "hub",
  })
  @ApiQuery({
    name: "name",
    description: "the filter option for the name of the role",
    required: false,
    example: "Admin",
  })
  @ApiOkResponse({
    status: 200,
    description: "The list of all available roles",
    type: [OutputRoleDto],
  })
  @Get("roles")
  async getRoles(@Query("app") app?: string, @Query("name") name?: string): Promise<OutputRoleDto[]> {
    const filters: FilterType = {};
    if (app) {
      filters.app = app;
    }
    if (name) {
      filters.name = name;
    }
    return plainToInstance(OutputRoleDto, await this.authorizationService.getAllRoles(filters), {
      excludeExtraneousValues: true,
    });
  }

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOkResponse({
    status: 200,
    description: "Retrieve a single role by the given ID",
  })
  @Get("roles/:id")
  async getRoleById(@Param("id") id: string): Promise<OutputRoleDto> {
    return plainToInstance(OutputRoleDto, await this.authorizationService.getRoleById(id), {
      excludeExtraneousValues: true,
    });
  }

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiBody({
    description: "Creates a new role in database",
    type: CreateUpdateRoleDto,
    required: true,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post("roles")
  async createRole(@Body() role: CreateUpdateRoleDto) {
    return this.authorizationService.createRole(role);
  }

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @Put("roles/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: "Updates a role",
  })
  async updateRole(@Param("id") id: string, @Body() roleDto: RoleDto) {
    return this.authorizationService.updateRole(id, roleDto);
  }

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: "Deletes a role",
  })
  @Delete("roles/:id")
  async deleteRole(@Param("id") id: string) {
    await this.authorizationService.deleteRole(id);
  }

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @Get("users")
  async getUsers(): Promise<OutputUserDto[]> {
    return plainToInstance(OutputUserDto, await this.authorizationService.getAllUsers(), {
      excludeExtraneousValues: true,
    });
  }

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("users/:id")
  async getUserById(@Param("id") id: string): Promise<OutputUserDto> {
    const user: User = await this.authorizationService.getUserById(id);

    return plainToInstance(OutputUserDto, user, { excludeExtraneousValues: true });
  }

  @IsPublic(false)
  @UseGuards(AccessGuard)
  @Put("users/:id")
  async updateUser(@Param("id") id: string, @Body() userData: UserDto) {
    await this.authorizationService.updateUser(id, userData);
  }
}