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
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '@/middleware/AuthGuard';
import { FindAllUsersPipe } from '@modules/welcome/pipes/find-all-users.pipe';
import { plainToInstance } from 'class-transformer';
import { WelcomeUser } from './entities/user.entity';
import { IsPrivate } from '@/decorators/isPrivate';

@ApiTags('welcome')
@Controller('welcome')
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Post('users')
  @IsPrivate()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: 'Create User', description: 'Returns new user.' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'User created', type: WelcomeUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.welcomeService.createUser(createUserDto);
  }

  @Get('users')
  @IsPrivate()
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
  @IsPrivate()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'id', type: String, required: false, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOperation({ summary: 'Find one user', description: 'Returns one user' })
  @ApiOkResponse({ description: 'OK', type: WelcomeUserDto })
  async findOne(@Param('id') id: string): Promise<WelcomeUserDto> {
    return plainToInstance(WelcomeUserDto, await this.welcomeService.findOne(id), { excludeExtraneousValues: true });
  }

  @IsPrivate()
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
  @IsPrivate()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'id', type: String, required: false, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Update One User', description: 'Update user' })
  @ApiOkResponse({ description: 'OK', type: WelcomeUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<WelcomeUserDto> {
    return plainToInstance(WelcomeUserDto, await this.welcomeService.update(id, updateUserDto), {
      excludeExtraneousValues: true,
    });
  }

  @Post('transform-property')
  @IsPrivate()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @HttpCode(201)
  async transformAppGames(@Query('name') propertyName: string): Promise<{ status: string }> {
    return await this.welcomeService.transformDbOjectStringsToArray(propertyName);
  }
}
