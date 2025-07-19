import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('Validating environment configuration...');
    const requiredEnvVars = ['DATABASE_URL'];
    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingVars.length > 0) {
      logger.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    } else {
      logger.log('Environment configuration validated successfully');
    }

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const { method, url, ip } = req;

      logger.log(`${method} ${url} - ${ip} - ${new Date().toISOString()}`);

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { statusCode } = res;
        const logLevel = statusCode >= 400 ? 'error' : 'log';
        logger[logLevel](`${method} ${url} - ${statusCode} - ${duration}ms`);
      });

      next();
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('MoodNiko API Documentation')
      .setDescription(
        'Mood-based content recommendation APIs for movies, music, podcasts, and books',
      )
      .setVersion('1.0')
      .addTag('auth', 'User login')
      .addTag('contents', 'Content management and recommendations')
      .addTag('Saved Contents', 'User saved content operations')
      .addTag('Books', 'Book recommendations')
      .addTag('Movies', 'Movie recommendations')
      .addTag('Spotify', 'Spotify music and podcast recommendations')
      .addTag('health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const env = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || 4002;

    await app.listen(port);

    logger.log(`Server is running on http://localhost:${port} in ${env} mode`);
    logger.log(
      `API Documentation available at http://localhost:${port}/api/docs`,
    );
    logger.log(`Health checks available at http://localhost:${port}/health`);
    logger.log(`Environment: ${env}`);
    logger.log(`Started at: ${new Date().toISOString()}`);

    const gracefulShutdown = async (signal: string) => {
      logger.log(`\n${signal} received, shutting down gracefully...`);
      try {
        await app.close();
        logger.log('Server closed successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start application:', error.stack);
    process.exit(1);
  }
}

bootstrap();
