import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { MicrosoftService } from './microsoft.service';
import { MsUser } from './types/microsoft.types';
import { IsPublic } from '@/decorators/isPublic';

@ApiTags('Microsoft')
@ApiBearerAuth()
@Controller('microsoft')
export class MicrosoftController {
  constructor(private readonly microsoftService: MicrosoftService) {}

  @Get('users')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users', description: 'Returns a list of all Microsoft users.' })
  @ApiQuery({
    name: 'email',
    description: 'Optional user address email',
    required: false,
    example: 'john.doe@daveo.fr',
  })
  @ApiOkResponse({
    status: 200,
    description: 'List of all users',
  })
  async getUsers(@Query('email') email?: string): Promise<MsUser[] | MsUser | null> {
    if (email) {
      return this.microsoftService.getUserByEmail(email);
    }
    return await this.microsoftService.getUsers();
  }

  @Get('users/:id')
  @IsPublic()
  @ApiOperation({ summary: 'Get user by ID', description: 'Returns a single Microsoft user by ID.' })
  @ApiOkResponse({
    status: 200,
    description: 'a single user details',
  })
  async getUserById(@Param('id') id: string): Promise<MsUser> {
    return await this.microsoftService.getUserById(id);
  }
}
