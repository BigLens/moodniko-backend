import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const env = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || 4002;

  app.listen(port);

  logger.log(`Server is running on http://localhost:${port} in ${env} mode`);
}
bootstrap();
