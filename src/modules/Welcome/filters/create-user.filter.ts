import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CreateUserExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res: string | object = exception.getResponse();
    const status: number = exception.getStatus();

    const message = 'At least one attribute is missing or not correct';

    response.status(status).json({
      statusCode: status,
      message: message,
      error: res,
    });
  }
}
