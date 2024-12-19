import { CreatePracticeDto } from "@modules/practice/dto/create-practice.dto";
import { UpdatePracticeDto } from "@modules/practice/dto/update-practice.dto";
import { PracticeService } from "@modules/practice/practice.service";
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Put, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Practice } from "@modules/practice/entities/practice.entity";
import { Role, Roles } from "@src/decorators/role";

@ApiTags("Practice")
@Controller("practices")
@ApiBearerAuth()
export class PracticeController {
  public constructor(private readonly practiceService: PracticeService) { }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a practice", description: "Returns a new practice" })
  @ApiCreatedResponse({ description: "Ok", type: Practice })
  @ApiConflictResponse({ description: "Conflict" })
  public async create(@Body() createPracticeDto: CreatePracticeDto): Promise<Practice> {
    return this.practiceService.create(createPracticeDto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Find all practices", description: "Returns all practices" })
  @ApiOkResponse({ description: "Ok", type: [Practice] })
  public async findAll(): Promise<Practice[]> {
    return this.practiceService.findAll();
  }

  @Get(":id")
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Find a practice by id", description: "Returns a practice or 404" })
  @ApiOkResponse({ description: "Ok", type: Practice })
  @ApiNotFoundResponse({ description: "Not found" })
  public async findOne(@Param("id") id: string): Promise<Practice> {
    return this.practiceService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a practice", description: "Returns the updated practice" })
  @ApiOkResponse({ description: "Ok", type: Practice })
  @ApiNotFoundResponse({ description: "Not found" })
  public async update(@Param("id") id: string, @Body() updatePracticeDto: UpdatePracticeDto): Promise<Practice> {
    return this.practiceService.update(id, updatePracticeDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a practice", description: "Returns 204" })
  @ApiNoContentResponse({ description: "Ok" })
  @ApiNotFoundResponse({ description: "Not found" })
  public async remove(@Param("id") id: string): Promise<void> {
    await this.practiceService.remove(id);
  }
}