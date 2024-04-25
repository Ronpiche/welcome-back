import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const httpsOptions = {
    key: process.env.ssl_key,
    cert: process.env.ssl_cert,
  };
  const app = await NestFactory.create(AppModule, {
    //httpsOptions,
  });
  app.use(cookieParser());
  app.enableCors({
    //origin: "https://hub.daveo.fr",
    credentials: true,
  });
  await app.listen(process.env.PORT);
}
bootstrap();
