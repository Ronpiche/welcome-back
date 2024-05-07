import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';
import mockedServer from '../mocks/mockServiceWorker';
import { AppModule } from './app.module';

const DEFAULT_HTTP_PORT = 3337;

async function bootstrap() {
  const logger = new Logger('hub-back');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.HUB_FRONT_URL,
    credentials: true,
  });

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('HUB module')
    .setDescription('The HUB API description')
    .setVersion('1.0')
    .addTag('hub')
    .addSecurity('bearer', {
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      validationError: { target: false, value: true },
      whitelist: true,
      //exceptionFactory: (errors: ValidationError[]) => new UnprocessableEntityException(errors),
    }),
  );

  // Start the mock server in development mode
  // if (process.env.NODE_ENV === 'development') {
  //   mockedServer.listen();
  // }

  await app.listen(process.env.PORT || DEFAULT_HTTP_PORT);

  logger.log(`Application running on port ${process.env.PORT || DEFAULT_HTTP_PORT}`);
}

bootstrap();
