import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterType } from './types/authorization.types';
import { IsPublic } from '@/decorators/isPublic';
import { RoleDto, UserDto } from './dto/authorization.dto';
import { CreateUpdateRoleDto } from './dto/create-role.dto';

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'app',
    description: 'the filter option for the targetted app',
    required: false,
    example: 'hub',
  })
  @ApiQuery({
    name: 'name',
    description: 'the filter option for the name of the role',
    required: false,
    example: 'Admin',
  })
  @ApiOkResponse({
    status: 200,
    description: 'The list of all available roles',
    type: [CreateUpdateRoleDto],
  })
  @Get('roles')
  async getRoles(@Query('app') app?: string, @Query('name') name?: string): Promise<CreateUpdateRoleDto[]> {
    const filters: FilterType = {};
    if (app) {
      filters.app = app;
    }
    if (name) {
      filters.name = name;
    }
    return this.authorizationService.getAllRoles(filters);
  }

  @IsPublic()
  @ApiOkResponse({
    status: 200,
    description: 'Retrieve a single role by the given ID',
  })
  @Get('roles/:id')
  async getRoleById(@Param('id') id: string) {
    return this.authorizationService.getRoleById(id);
  }

  @IsPublic()
  @ApiBody({
    description: 'Creates a new role in database',
    type: CreateUpdateRoleDto,
    required: true,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('roles')
  async createRole(@Body() role: CreateUpdateRoleDto) {
    return this.authorizationService.createRole(role);
  }

  @IsPublic()
  @Put('roles/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: 'Updates a role',
  })
  async updateRole(@Param('id') id: string, @Body() roleDto: RoleDto) {
    return this.authorizationService.updateRole(id, roleDto);
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: 'Deletes a role',
  })
  @Delete('roles/:id')
  async deleteRole(@Param('id') id: string) {
    return this.authorizationService.deleteRole(id);
  }

  @IsPublic()
  @Get('users')
  async getUsers() {
    return this.authorizationService.getAllUsers();
  }

  @IsPublic()
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.authorizationService.getUserById(id);
  }

  @IsPublic()
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() userData: UserDto) {
    this.authorizationService.updateUser(id, userData);
  }
}
