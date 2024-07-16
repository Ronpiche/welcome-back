import { Response } from 'express';
import { Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '@/middleware/AuthGuard';
import { IsPrivate } from '@/decorators/isPrivate';
import { EmailService } from './email.service';
import { EmailRunKO, EmailRunOK } from './dto/output/email-run.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('run')
  @IsPrivate()
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: 'Notify users',
    description: 'Search users that have unlocked steps and send them an email.',
  })
  @ApiCreatedResponse({ description: 'Users notified', type: EmailRunOK, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Error on user notification', type: EmailRunKO, isArray: true })
  async run(@Res({ passthrough: true }) response: Response) {
    const results = await this.emailService.run(new Date());
    if (results.some((result) => result.status === 'rejected')) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return results;
  }
}
