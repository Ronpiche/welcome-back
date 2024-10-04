import { CreateQuizDto } from "@modules/quiz/dto/create-quiz.dto";
import { UpdateQuizDto } from "@modules/quiz/dto/update-quiz.dto";
import { QuizUserAnswerDto } from "@modules/quiz/dto/quiz-user-answer.dto";
import { QuizService } from "@modules/quiz/quiz.service";
import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus, Put, HttpCode } from "@nestjs/common";
import { IsPublic } from "@src/decorators/isPublic";
import { AccessGuard } from "@src/middleware/AuthGuard";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Quiz } from "@modules/quiz/entities/quiz.entity";

@ApiTags("quiz")
@Controller("quizzes")
export class QuizController {
  public constructor(private readonly quizService: QuizService) {}

  @Post()
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiCreatedResponse({ description: "OK", type: Quiz })
  public async create(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: "OK", type: [Quiz] })
  public async findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Get(":id")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: "OK", type: Quiz })
  public async findOne(@Param("id") id: string): Promise<Quiz> {
    return this.quizService.findOne(id);
  }

  @Put(":id")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: "OK", type: Quiz })
  public async update(@Param("id") id: string, @Body() updateStepDto: UpdateQuizDto): Promise<Quiz> {
    return this.quizService.update(id, updateStepDto);
  }

  @Delete(":id")
  @IsPublic(false)
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: "OK" })
  public async remove(@Param("id") id: string): Promise<void> {
    await this.quizService.remove(id);
  }

  @Post(":id")
  @IsPublic(true)
  @ApiCreatedResponse({ description: "Are answers true ?", type: Boolean })
  public async isValid(@Param("id") id: string, @Body() userAnswerDto: QuizUserAnswerDto): Promise<boolean> {
    return this.quizService.isValid(id, userAnswerDto.questionIndex, userAnswerDto.answerIndexes);
  }
}