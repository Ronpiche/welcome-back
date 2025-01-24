import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import session from "express-session";
import memoryStore from "memorystore";
import { AppModule } from "src/app.module";

const DAY_IN_MS = 86400000;
const DEFAULT_HTTP_PORT = 8080;

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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const MemoryStore = memoryStore(session);
  const configService = app.get<ConfigService>(ConfigService);
  const port = Number(configService.get("PORT")) || DEFAULT_HTTP_PORT;

  app.set("trust proxy", true);
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.use(session({
    cookie: { maxAge: DAY_IN_MS, sameSite: "none", secure: true },
    secret: configService.get("SESSION_SECRET"),
    store: new MemoryStore({ checkPeriod: DAY_IN_MS }),
    resave: false,
    saveUninitialized: false,
  }));
  app.enableCors({ origin: [configService.get("HUB_FRONT_URL")], credentials: true });

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