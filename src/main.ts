import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new RpcExceptionFilter());
  app.setGlobalPrefix('api');
  await app.listen(envs.port);
  logger.log(`Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
