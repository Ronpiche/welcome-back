import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '@/middleware/AuthGuard';
import { IsPrivate } from '@/decorators/isPrivate';
import { EmailService } from './email.service';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('run')
  @IsPrivate()
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: 'Notify users', description: 'Search users that unlock next step and send email to them.' })
  @ApiOkResponse({ description: 'Users notified' })
  create() {
    return this.emailService.run();
  }
}
