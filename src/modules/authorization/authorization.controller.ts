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
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationService } from "./authorization.service";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FilterType } from "./types/authorization.types";
import { RoleDto, UserDto } from "./dto/authorization.dto";
import { CreateUpdateRoleDto } from "./dto/create-role.dto";
import { plainToInstance } from "class-transformer";
import { OutputRoleDto } from "./dto/outputRole.dto";
import { OutputUserDto } from "./dto/OutputUser.dto";
import { User } from "./entities/User.entity";
import { Role, Roles } from "@src/decorators/role";

@ApiTags("Authorization")
@ApiBearerAuth()
@Controller("authorization")
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Get("roles")
  @Roles(Role.ADMIN)
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

  @Get("roles/:id")
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    status: 200,
    description: "Retrieve a single role by the given ID",
  })
  async getRoleById(@Param("id") id: string): Promise<OutputRoleDto> {
    return plainToInstance(OutputRoleDto, await this.authorizationService.getRoleById(id), {
      excludeExtraneousValues: true,
    });
  }

  @Post("roles")
  @Roles(Role.ADMIN)
  @ApiBody({
    description: "Creates a new role in database",
    type: CreateUpdateRoleDto,
    required: true,
  })
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() role: CreateUpdateRoleDto) {
    return this.authorizationService.createRole(role);
  }

  @Put("roles/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: "Updates a role",
  })
  async updateRole(@Param("id") id: string, @Body() roleDto: RoleDto) {
    return this.authorizationService.updateRole(id, roleDto);
  }

  @Delete("roles/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: "Deletes a role",
  })
  async deleteRole(@Param("id") id: string) {
    await this.authorizationService.deleteRole(id);
  }

  @Get("users")
  @Roles(Role.ADMIN)
  async getUsers(): Promise<OutputUserDto[]> {
    return plainToInstance(OutputUserDto, await this.authorizationService.getAllUsers(), {
      excludeExtraneousValues: true,
    });
  }

  @Get("users/:id")
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserById(@Param("id") id: string): Promise<OutputUserDto> {
    const user: User = await this.authorizationService.getUserById(id);

    return plainToInstance(OutputUserDto, user, { excludeExtraneousValues: true });
  }

  @Put("users/:id")
  @Roles(Role.ADMIN)
  async updateUser(@Param("id") id: string, @Body() userData: UserDto) {
    await this.authorizationService.updateUser(id, userData);
  }
}