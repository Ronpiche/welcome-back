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
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { plainToInstance } from "class-transformer";
import { OutputMembersDto } from "./dto/output-members.dto";
import { Member } from "./entities/member.entity";
import { ApiOperation, ApiBody, ApiOkResponse, ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Role, Roles } from "@src/decorators/role";

@ApiTags("members")
@Controller("members")
@ApiBearerAuth()
export class MembersController {
  public constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create a member", description: "Returns a new mamber" })
  @ApiBody({ type: CreateMemberDto })
  @ApiOkResponse({ description: "member created", type: OutputMembersDto })
  public create(@Body() createMemberDto: CreateMemberDto): OutputMembersDto {
    return plainToInstance(OutputMembersDto, this.membersService.create(createMemberDto), {
      excludeExtraneousValues: true,
    });
  }

  @Post("create-many")
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create many members" })
  @ApiBody({ type: Array<CreateMemberDto> })
  @ApiOkResponse({ description: "OK" })
  public async createMany(@Body() createMemberDto: CreateMemberDto[]): Promise<void> {
    await this.membersService.createMany(createMemberDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Find all members", description: "Returns all members" })
  @ApiOkResponse({ description: "find all members", type: Array<OutputMembersDto> })
  public async findAll(): Promise<OutputMembersDto[]> {
    const members: Member[] = await this.membersService.findAll();

    return members.map(member => plainToInstance(OutputMembersDto, member, { excludeExtraneousValues: true }));
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "update a member", description: "Returns a updated member" })
  @ApiParam({ name: "id", type: String, required: true, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiBody({ type: UpdateMemberDto })
  @ApiOkResponse({ description: "member updated", type: OutputMembersDto })
  public update(@Param("id") id: string, @Body() updateMemberDto: UpdateMemberDto): OutputMembersDto {
    return plainToInstance(OutputMembersDto, this.membersService.update(id, updateMemberDto), {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Delete a member" })
  @ApiParam({ name: "id", type: String, required: true, example: "123e4567-e89b-12d3-a456-426614174000" })
  @ApiOkResponse({ description: "OK" })
  public remove(@Param("id") id: string): void {
    this.membersService.remove(id);
  }
}