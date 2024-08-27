import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus, Put, HttpCode } from '@nestjs/common';
import { StepService } from './step.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { IsPublic } from '@src/decorators/isPublic';
import { AccessGuard } from '@src/middleware/AuthGuard';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatedDto } from '../shared/dto/created.dto';

@ApiTags('step')
@Controller('steps')
export class StepController {
  constructor(private readonly stepService: StepService) {}

  @Post()
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiCreatedResponse({ description: 'OK', type: CreatedDto })
  async create(@Body() createStepDto: CreateStepDto): Promise<CreateStepDto> {
    return await this.stepService.create(createStepDto);
  }

  @Get()
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'OK', type: [CreateStepDto] })
  async findAll(): Promise<CreateStepDto[]> {
    return await this.stepService.findAll();
  }

  @Get(':id')
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'OK', type: CreateStepDto })
  async findOne(@Param('id') id: string): Promise<CreateStepDto> {
    return await this.stepService.findOne(id);
  }

  @Put(':id')
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'OK', type: CreateStepDto })
  async update(@Param('id') id: string, @Body() updateStepDto: UpdateStepDto): Promise<UpdateStepDto> {
    return await this.stepService.update(id, updateStepDto);
  }

  @Delete(':id')
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'OK' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.stepService.remove(id);
  }
}
