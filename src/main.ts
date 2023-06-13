import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from '@infra/http/filters/http-exception-filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origin = process.env.ORIGINS
    ? String(process.env.ORIGINS).split(', ')
    : '*';

  const originToAll = origin === '*';

  app.enableCors({
    origin: originToAll ? true : origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

  await app.listen(port);
}

bootstrap();
