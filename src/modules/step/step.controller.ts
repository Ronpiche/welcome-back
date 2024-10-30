import { CreatedDto } from "@modules/shared/dto/created.dto";
import { CreateStepDto } from "@modules/step/dto/create-step.dto";
import { UpdateStepDto } from "@modules/step/dto/update-step.dto";
import { StepService } from "@modules/step/step.service";
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Put, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Role, Roles } from "@src/decorators/role";

@ApiTags("step")
@Controller("steps")
@ApiBearerAuth()
export class StepController {
  public constructor(private readonly stepService: StepService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({ description: "OK", type: CreatedDto })
  public async create(@Body() createStepDto: CreateStepDto): Promise<CreateStepDto> {
    return this.stepService.create(createStepDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "OK", type: [CreateStepDto] })
  public async findAll(): Promise<CreateStepDto[]> {
    return this.stepService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "OK", type: CreateStepDto })
  public async findOne(@Param("id") id: string): Promise<CreateStepDto> {
    return this.stepService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "OK", type: CreateStepDto })
  public async update(@Param("id") id: string, @Body() updateStepDto: UpdateStepDto): Promise<UpdateStepDto> {
    return this.stepService.update(id, updateStepDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: "OK" })
  public async remove(@Param("id") id: string): Promise<void> {
    await this.stepService.remove(id);
  }
}