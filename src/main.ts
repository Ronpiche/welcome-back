import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import type { INestApplication } from "@nestjs/common";
import { Logger, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "src/app.module";
import session from "express-session";
import { ConfigService } from "@nestjs/config";

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
  const configService = app.get<ConfigService>(ConfigService);
  const port = Number(configService.get("PORT")) || DEFAULT_HTTP_PORT;

  app.setGlobalPrefix("api");

  app.use(cookieParser());
  app.use(session({
    secret: configService.get("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
  }));
  app.enableCors({ origin: [configService.get("HUB_FRONT_URL")], credentials: true });
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

  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
};

((): void => {
  bootstrap().catch((err: unknown) => {
    Logger.error(err);
  });
})();