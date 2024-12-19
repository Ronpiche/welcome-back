import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Put, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateClientDto } from "@modules/client/dto/create-client.dto";
import { UpdateClientDto } from "@modules/client/dto/update-client.dto";
import { ClientService } from "@modules/client/client.service";
import { Client } from "@modules/client/entities/client.entity";
import { Role, Roles } from "@src/decorators/role";

@ApiTags("Client")
@Controller("clients")
@ApiBearerAuth()
export class ClientController {
  public constructor(private readonly practiceService: ClientService) { }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a client", description: "Returns a new client" })
  @ApiCreatedResponse({ description: "Ok", type: Client })
  @ApiConflictResponse({ description: "Conflict" })
  public async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.practiceService.create(createClientDto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Find all clients", description: "Returns all clients" })
  @ApiOkResponse({ description: "Ok", type: [Client] })
  public async findAll(): Promise<Client[]> {
    return this.practiceService.findAll();
  }

  @Get(":id")
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Find a client by id", description: "Returns a client or 404" })
  @ApiOkResponse({ description: "Ok", type: Client })
  @ApiNotFoundResponse({ description: "Not found" })
  public async findOne(@Param("id") id: string): Promise<Client> {
    return this.practiceService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a client", description: "Returns the updated client" })
  @ApiOkResponse({ description: "Ok", type: Client })
  @ApiNotFoundResponse({ description: "Not found" })
  public async update(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto): Promise<Client> {
    return this.practiceService.update(id, updateClientDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a client", description: "Returns 204" })
  @ApiNoContentResponse({ description: "Ok" })
  @ApiNotFoundResponse({ description: "Not found" })
  public async remove(@Param("id") id: string): Promise<void> {
    await this.practiceService.remove(id);
  }
}