import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import { CreateUserDto } from './dto/input/create-user.dto';
import { UpdateUserDto } from './dto/input/update-user.dto';
import { OutputCreateUserDto } from './dto/output/output-create-user.dto';
import { IsPublic } from '@/decorators/isPublic';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '@/middleware/AuthGuard';

@ApiTags('Welcome')
@Controller('welcome')
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Post('users')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: 'Create User', description: 'Returns new user.' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'User created', type: OutputCreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.welcomeService.createUser(createUserDto);
  }

  @Get('users')
  @IsPublic()
  findAll() {
    return this.welcomeService.findAll();
  }

  @Get('users/:id')
  @IsPublic()
  findOne(@Param('id') id: string) {
    return this.welcomeService.findOne(id);
  }

  @Patch('users/:id')
  @IsPublic()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.welcomeService.update(id, updateUserDto);
  }

  @IsPublic()
  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.welcomeService.remove(id);
  }
}
