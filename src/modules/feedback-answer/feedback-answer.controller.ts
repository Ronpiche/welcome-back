import { FeedbackAnswerService } from "@modules/feedback-answer/feedback-answer.service";
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Put, HttpCode, Request, NotFoundException } from "@nestjs/common";
import { ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FeedbackAnswer } from "@modules/feedback-answer/entities/feedback-answer.entity";
import { Role, Roles } from "@src/decorators/role";
import { UserRequest } from "@src/guards/jwt.guard";

@ApiTags("Feedback")
@Controller("feedbacks")
export class FeedbackAnswerController {
  public constructor(private readonly feedbackAnswerService: FeedbackAnswerService) { }

  @Post(":id/questions/:questionId/answers/me")
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Create my feedback answer", description: "Returns a new feedback answer" })
  @ApiCreatedResponse({ description: "Ok", type: FeedbackAnswer })
  @ApiConflictResponse({ description: "Conflict" })
  public async createForMe(
    @Param("id") id: string,
    @Param("questionId") questionId: string,
    @Request() { user }: UserRequest,
    @Body() answers: string[],
  ): Promise<FeedbackAnswer> {
    return this.feedbackAnswerService.create(id, questionId, user.id, answers);
  }

  @Post(":id/questions/:questionId/answers/:userId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a feedback answer", description: "Returns a new feedback answer" })
  @ApiCreatedResponse({ description: "Ok", type: FeedbackAnswer })
  @ApiConflictResponse({ description: "Conflict" })
  public async create(
    @Param("id") id: string,
    @Param("questionId") questionId: string,
    @Param("userId") userId: string,
    @Body() answers: string[],
  ): Promise<FeedbackAnswer> {
    return this.feedbackAnswerService.create(id, questionId, userId, answers);
  }

  @Get(":id/questions/:questionId/answers")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Find all feedback answers", description: "Returns all feedback answers" })
  @ApiOkResponse({ description: "Ok", type: [FeedbackAnswer] })
  public async findAll(@Param("id") id: string, @Param("questionId") questionId: string): Promise<FeedbackAnswer[]> {
    return this.feedbackAnswerService.findAll(id, questionId);
  }

  @Get(":id/questions/:questionId/answers/me")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Find my feedback answer", description: "Returns a feedback answer or 404" })
  @ApiOkResponse({ description: "Ok", type: FeedbackAnswer })
  @ApiNotFoundResponse({ description: "Not found" })
  public async findMine(@Param("id") id: string, @Param("questionId") questionId: string, @Request() { user }: UserRequest): Promise<FeedbackAnswer> {
    try {
      return await this.feedbackAnswerService.findOne(id, questionId, user.id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        return null;
      }
    }
  }

  @Get(":id/questions/:questionId/answers/:userId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Find a feedback answer by id", description: "Returns a feedback answer or 404" })
  @ApiOkResponse({ description: "Ok", type: FeedbackAnswer })
  @ApiNotFoundResponse({ description: "Not found" })
  public async findOne(@Param("id") id: string, @Param("questionId") questionId: string, @Param("userId") userId: string): Promise<FeedbackAnswer> {
    return this.feedbackAnswerService.findOne(id, questionId, userId);
  }

  @Put(":id/questions/:questionId/answers/:userId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a feedback answer", description: "Returns the updated feedback answer" })
  @ApiOkResponse({ description: "Ok", type: FeedbackAnswer })
  @ApiNotFoundResponse({ description: "Not found" })
  public async update(
    @Param("id") id: string,
    @Param("questionId") questionId: string,
    @Param("userId") userId: string,
    @Body() answers: string[],
  ): Promise<FeedbackAnswer> {
    return this.feedbackAnswerService.update(id, questionId, userId, answers);
  }

  @Delete(":id/questions/:questionId/answers/:userId")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a feedback answer", description: "Returns 204" })
  @ApiNoContentResponse({ description: "Ok" })
  @ApiNotFoundResponse({ description: "Not found" })
  public async remove(@Param("id") id: string, @Param("questionId") questionId: string, @Param("userId") userId: string): Promise<void> {
    await this.feedbackAnswerService.remove(id, questionId, userId);
  }
}