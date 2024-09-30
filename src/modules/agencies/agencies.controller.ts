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
import { IsPublic } from "@src/decorators/isPublic";
import { Agency } from "./entities/agency.entity";
import { ApiOperation, ApiBody, ApiOkResponse, ApiTags, ApiParam } from "@nestjs/swagger";

@ApiTags("agencies")
@Controller("agencies")
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create an agency", description: "Returns a new agency" })
  @ApiBody({ type: CreateAgencyDto })
  @ApiOkResponse({ description: "agency created", type: OutputAgencyDto })
  create(@Body() createAgencyDto: CreateAgencyDto): OutputAgencyDto {
    return plainToInstance(OutputAgencyDto, this.agenciesService.create(createAgencyDto), {
      excludeExtraneousValues: true,
    });
  }

  @Post("create-many")
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create many agencies" })
  @ApiBody({ type: Array<CreateAgencyDto> })
  @ApiOkResponse({ description: "OK" })
  async createMany(@Body() createAgenciesDto: CreateAgencyDto[]): Promise<void> {
    await this.agenciesService.createMany(createAgenciesDto);
  }

  @Get()
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Find all agencies", description: "Returns all agencies" })
  @ApiOkResponse({ description: "find all agencies", type: Array<OutputAgencyDto> })
  async findAll(): Promise<OutputAgencyDto[]> {
    const agencies: Agency[] = await this.agenciesService.findAll();

    return agencies.map(agency => plainToInstance(OutputAgencyDto, agency, { excludeExtraneousValues: true }));
  }

  @Put(":id")
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "update an agency", description: "Returns a updated agency" })
  @ApiParam({ name: "id", type: String, required: true, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiBody({ type: UpdateAgencyDto })
  @ApiOkResponse({ description: "agency updated", type: OutputAgencyDto })
  update(@Param("id") id: string, @Body() updateAgencyDto: UpdateAgencyDto): OutputAgencyDto {
    return plainToInstance(OutputAgencyDto, this.agenciesService.update(id, updateAgencyDto), {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Delete an agency" })
  @ApiParam({ name: "id", type: String, required: true, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiOkResponse({ description: "OK" })
  remove(@Param("id") id: string): void {
    this.agenciesService.remove(id);
  }
}