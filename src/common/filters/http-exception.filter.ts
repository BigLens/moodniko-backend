import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const rawMessage = (exceptionResponse as { message: string | string[] })
          .message;
        message = Array.isArray(rawMessage)
          ? rawMessage.join(', ')
          : rawMessage;
        errorDetails = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = {
        name: exception.name,
        stack: exception.stack,
      };
    }

    // Enhanced logging based on error type
    const logData = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      statusCode: status,
      message,
      errorDetails,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    // Log with appropriate level based on status code
    if (status >= 500) {
      this.logger.error('Server Error:', logData);
    } else if (status >= 400) {
      this.logger.warn('Client Error:', logData);
    } else {
      this.logger.log('Application Error:', logData);
    }

    // Return structured error response
    const errorResponse = {
      statusCode: status,
      message,
      timestamp: logData.timestamp,
      path: request.url,
      method: request.method,
      ...(process.env.NODE_ENV === 'development' && {
        error: errorDetails,
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    response.status(status).json(errorResponse);
  }
}
