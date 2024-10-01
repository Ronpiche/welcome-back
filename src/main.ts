import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

const DEFAULT_HTTP_PORT = 3337;

async function bootstrap() {
  const logger = new Logger("welcome-back");
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.use(cookieParser());
  app.enableCors();
  /*
   * app.enableCors({
   *   origin: [
   *     'https://daveo-gcp-welcome-sbx-cr-front-hub-s5fhodvgxa-od.a.run.app',
   *     'https://dev-hub.daveo.fr',
   *     'https://daveo-gcp-welcome-sbx-cr-front-s5fhodvgxa-od.a.run.app',
   *   ],
   *   credentials: true,
   * });
   * if (process.env.NODE_ENV === 'dev') {
   *   app.enableCors();
   * }
   */

  // swagger
  const config = new DocumentBuilder()
    .setTitle("Welcome Back")
    .setDescription("API description")
    .setVersion("0.0.1")
    .addTag("Welcome")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  // validation Pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    disableErrorMessages: false,
    validationError: { target: false, value: true },
    whitelist: true,
  }));

  await app.listen(process.env.PORT || DEFAULT_HTTP_PORT);
  logger.log(`Application running on port ${process.env.PORT || DEFAULT_HTTP_PORT}`);
}

bootstrap();