import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import type { INestApplication } from "@nestjs/common";
import { Logger, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "src/app.module";

const DEFAULT_HTTP_PORT = 3337;

const swaggerSetup = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle("Welcome Back")
    .setDescription("API description")
    .setVersion("0.0.1")
    .addTag("Welcome")
    .addBearerAuth({
      description: "Token in format: Bearer &lt;JWT&gt;",
      name: "Authorization",
      bearerFormat: "Bearer",
      scheme: "Bearer",
      type: "http",
      in: "Header",
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);
};

const bootstrap = async(): Promise<void> => {
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

  swaggerSetup(app);

  // validation Pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    disableErrorMessages: false,
    validationError: { target: false, value: true },
    whitelist: true,
  }));

  await app.listen(process.env.PORT || DEFAULT_HTTP_PORT);
};

((): void => {
  const logger = new Logger("welcome-back");
  bootstrap().then(() => {
    logger.log(`Application running on port ${process.env.PORT || DEFAULT_HTTP_PORT}`);
  }).catch((err: unknown) => {
    logger.error(err);
  });
})();