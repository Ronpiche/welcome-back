import { CreateQuizDto } from "@modules/quiz/dto/create-quiz.dto";
import { UpdateQuizDto } from "@modules/quiz/dto/update-quiz.dto";
import { QuizUserAnswerDto } from "@modules/quiz/dto/quiz-user-answer.dto";
import { QuizService } from "@modules/quiz/quiz.service";
import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus, Put, HttpCode } from "@nestjs/common";
import { IsPublic } from "@src/decorators/isPublic";
import { AccessGuard } from "@src/middleware/AuthGuard";
import { ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Quiz } from "@modules/quiz/entities/quiz.entity";

@ApiTags("quiz")
@Controller("quizzes")
export class QuizController {
  public constructor(private readonly quizService: QuizService) {}

  @Post()
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: "Create a quiz", description: "Returns a new quiz" })
  @ApiCreatedResponse({ description: "Ok", type: Quiz })
  @ApiConflictResponse({ description: "Conflict" })
  public async create(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: "Find all quizzes", description: "Returns all quizzes" })
  @ApiOkResponse({ description: "Ok", type: [Quiz] })
  public async findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Get(":id")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: "Find a quiz by id", description: "Returns a quiz or 404" })
  @ApiOkResponse({ description: "Ok", type: Quiz })
  @ApiNotFoundResponse({ description: "Not found" })
  public async findOne(@Param("id") id: string): Promise<Quiz> {
    return this.quizService.findOne(id);
  }

  @Put(":id")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: "Update a quiz", description: "Returns the updated quiz" })
  @ApiOkResponse({ description: "Ok", type: Quiz })
  @ApiNotFoundResponse({ description: "Not found" })
  public async update(@Param("id") id: string, @Body() updateStepDto: UpdateQuizDto): Promise<Quiz> {
    return this.quizService.update(id, updateStepDto);
  }

  @Delete(":id")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a quiz", description: "Returns 204" })
  @ApiNoContentResponse({ description: "Ok" })
  @ApiNotFoundResponse({ description: "Not found" })
  public async remove(@Param("id") id: string): Promise<void> {
    await this.quizService.remove(id);
  }

  @Post(":id")
  @HttpCode(200)
  @IsPublic(true)
  @ApiOperation({ summary: "Check the correctness of an answer", description: "Returns true or false" })
  @ApiOkResponse({ description: "Are answers true ?", type: Boolean })
  @ApiNotFoundResponse({ description: "Not found" })
  public async isValid(@Param("id") id: string, @Body() userAnswerDto: QuizUserAnswerDto): Promise<boolean> {
    return this.quizService.isValid(id, userAnswerDto.questionIndex, userAnswerDto.answerIndexes);
  }
}