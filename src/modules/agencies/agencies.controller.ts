import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
} from "@nestjs/common";
import { AgenciesService } from "./agencies.service";
import { CreateAgencyDto } from "./dto/create-agency.dto";
import { UpdateAgencyDto } from "./dto/update-agency.dto";
import { plainToInstance } from "class-transformer";
import { OutputAgencyDto } from "./dto/output-agency.dto";
import { Agency } from "./entities/agency.entity";
import { ApiOperation, ApiBody, ApiOkResponse, ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Role, Roles } from "@src/decorators/role";

@ApiTags("agencies")
@Controller("agencies")
@ApiBearerAuth()
export class AgenciesController {
  public constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create an agency", description: "Returns a new agency" })
  @ApiBody({ type: CreateAgencyDto })
  @ApiOkResponse({ description: "agency created", type: OutputAgencyDto })
  public create(@Body() createAgencyDto: CreateAgencyDto): OutputAgencyDto {
    return plainToInstance(OutputAgencyDto, this.agenciesService.create(createAgencyDto), {
      excludeExtraneousValues: true,
    });
  }

  @Post("create-many")
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create many agencies" })
  @ApiBody({ type: Array<CreateAgencyDto> })
  @ApiOkResponse({ description: "OK" })
  public async createMany(@Body() createAgenciesDto: CreateAgencyDto[]): Promise<void> {
    await this.agenciesService.createMany(createAgenciesDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Find all agencies", description: "Returns all agencies" })
  @ApiOkResponse({ description: "find all agencies", type: Array<OutputAgencyDto> })
  public async findAll(): Promise<OutputAgencyDto[]> {
    const agencies: Agency[] = await this.agenciesService.findAll();

    return agencies.map(agency => plainToInstance(OutputAgencyDto, agency, { excludeExtraneousValues: true }));
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "update an agency", description: "Returns a updated agency" })
  @ApiParam({ name: "id", type: String, required: true, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiBody({ type: UpdateAgencyDto })
  @ApiOkResponse({ description: "agency updated", type: OutputAgencyDto })
  public update(@Param("id") id: string, @Body() updateAgencyDto: UpdateAgencyDto): OutputAgencyDto {
    return plainToInstance(OutputAgencyDto, this.agenciesService.update(id, updateAgencyDto), {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Delete an agency" })
  @ApiParam({ name: "id", type: String, required: true, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiOkResponse({ description: "OK" })
  public remove(@Param("id") id: string): void {
    this.agenciesService.remove(id);
  }
}