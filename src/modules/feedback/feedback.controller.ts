import { CreateFeedbackDto } from "@modules/feedback/dto/create-feedback.dto";
import { UpdateFeedbackDto } from "@modules/feedback/dto/update-feedback.dto";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Put, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Feedback } from "@modules/feedback/entities/feedback.entity";
import { Role, Roles } from "@src/decorators/role";

@ApiTags("Feedback")
@Controller("feedbacks")
@ApiBearerAuth()
export class FeedbackController {
  public constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a feedback", description: "Returns a new feedback" })
  @ApiCreatedResponse({ description: "Ok", type: Feedback })
  @ApiConflictResponse({ description: "Conflict" })
  public async create(@Body() createfeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(createfeedbackDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Find all feedbacks", description: "Returns all feedbacks" })
  @ApiOkResponse({ description: "Ok", type: [Feedback] })
  public async findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Find a feedback by id", description: "Returns a feedback or 404" })
  @ApiOkResponse({ description: "Ok", type: Feedback })
  @ApiNotFoundResponse({ description: "Not found" })
  public async findOne(@Param("id") id: string): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a feedback", description: "Returns the updated feedback" })
  @ApiOkResponse({ description: "Ok", type: Feedback })
  @ApiNotFoundResponse({ description: "Not found" })
  public async update(@Param("id") id: string, @Body() updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a feedback", description: "Returns 204" })
  @ApiNoContentResponse({ description: "Ok" })
  @ApiNotFoundResponse({ description: "Not found" })
  public async remove(@Param("id") id: string): Promise<void> {
    await this.feedbackService.remove(id);
  }
}