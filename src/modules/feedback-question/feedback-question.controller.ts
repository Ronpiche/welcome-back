import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Put, HttpCode } from "@nestjs/common";
import { ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role, Roles } from "@src/decorators/role";
import { CreateFeedbackQuestionDto } from "@modules/feedback-question/dto/create-feedback-question.dto";
import { UpdateFeedbackQuestionDto } from "@modules/feedback-question/dto/update-feedback-question.dto";
import { FeedbackQuestionService } from "@modules/feedback-question/feedback-question.service";
import { FeedbackQuestion } from "@modules/feedback-question/entities/feedback-question.entity";

@ApiTags("Feedback")
@Controller("feedbacks")
export class FeedbackQuestionController {
  public constructor(private readonly feedbackQuestionService: FeedbackQuestionService) { }

  @Post(":id/questions")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a feedback question", description: "Returns a new feedback question" })
  @ApiCreatedResponse({ description: "Ok", type: FeedbackQuestion })
  @ApiConflictResponse({ description: "Conflict" })
  public async create(@Param("id") id: string, @Body() createfeedbackDto: CreateFeedbackQuestionDto): Promise<FeedbackQuestion> {
    return this.feedbackQuestionService.create(id, createfeedbackDto);
  }

  @Get(":id/questions")
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Find all feedback questions", description: "Returns all feedback questions" })
  @ApiOkResponse({ description: "Ok", type: [FeedbackQuestion] })
  public async findAll(@Param("id") id: string): Promise<FeedbackQuestion[]> {
    return this.feedbackQuestionService.findAll(id);
  }

  @Get(":id/questions/:questionId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Find a feedback question by id", description: "Returns a feedback question or 404" })
  @ApiOkResponse({ description: "Ok", type: FeedbackQuestion })
  @ApiNotFoundResponse({ description: "Not found" })
  public async findOne(@Param("id") id: string, @Param("questionId") questionId: string): Promise<FeedbackQuestion> {
    return this.feedbackQuestionService.findOne(id, questionId);
  }

  @Put(":id/questions/:questionId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a feedback question", description: "Returns the updated feedback question" })
  @ApiOkResponse({ description: "Ok", type: FeedbackQuestion })
  @ApiNotFoundResponse({ description: "Not found" })
  public async update(
    @Param("id") id: string,
    @Param("questionId") questionId: string,
    @Body() updateFeedbackQuestionDto: UpdateFeedbackQuestionDto,
  ): Promise<FeedbackQuestion> {
    return this.feedbackQuestionService.update(id, questionId, updateFeedbackQuestionDto);
  }

  @Delete(":id/questions/:questionId")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a feedback question", description: "Returns 204" })
  @ApiNoContentResponse({ description: "Ok" })
  @ApiNotFoundResponse({ description: "Not found" })
  public async remove(@Param("id") id: string, @Param("questionId") questionId: string): Promise<void> {
    await this.feedbackQuestionService.remove(id, questionId);
  }
}