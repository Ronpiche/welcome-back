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
} from '@nestjs/common';
import { WelcomeService } from '@modules/welcome/welcome.service';
import { CreateUserDto } from '@modules/welcome/dto/input/create-user.dto';
import { UpdateUserDto } from '@modules/welcome/dto/input/update-user.dto';
import { WelcomeUserDto } from '@modules/welcome/dto/output/welcome-user.dto';
import { IsPublic } from '@/decorators/isPublic';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '@/middleware/AuthGuard';
import { FindAllUsersPipe } from '@modules/welcome/pipes/find-all-users.pipe';
import { plainToInstance } from 'class-transformer';
import { WelcomeUser } from './entities/user.entity';

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
  @ApiOkResponse({ description: 'User created', type: WelcomeUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.welcomeService.createUser(createUserDto);
  }

  @Get('users')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'arrivalDate[startDate]', type: String, required: false, example: '10/05/2024' })
  @ApiQuery({ name: 'arrivalDate[endDate]', type: String, required: false, example: '14/05/2024' })
  @ApiOperation({ summary: 'Find all users', description: 'Returns all users.' })
  @ApiOkResponse({ description: 'OK', type: [WelcomeUserDto] })
  async findAll(@Query('arrivalDate', FindAllUsersPipe) filter: any): Promise<WelcomeUserDto[]> {
    const users: WelcomeUser[] = await this.welcomeService.findAll(filter);
    return users.map((user) => plainToInstance(WelcomeUserDto, user, { excludeExtraneousValues: true }));
  }

  @Get('users/:id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'id', type: String, required: false, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOperation({ summary: 'Find one user', description: 'Returns one user' })
  @ApiOkResponse({ description: 'OK', type: WelcomeUserDto })
  async findOne(@Param('id') id: string): Promise<WelcomeUserDto> {
    return plainToInstance(WelcomeUserDto, await this.welcomeService.findOne(id), { excludeExtraneousValues: true });
  }

  @IsPublic()
  @Delete('users/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'id', type: String, required: false, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOperation({ summary: 'Remove one user', description: 'Remove user' })
  @ApiOkResponse({ description: 'User deleted' })
  async remove(@Param('id') id: string): Promise<string> {
    await this.welcomeService.remove(id);
    return 'User deleted';
  }

  @Put('users/:id')
  @IsPublic()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.welcomeService.update(id, updateUserDto);
  }
}
