import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

export function RegisterDoc() {
  return applyDecorators(
    ApiTags('auth'),
    ApiOperation({
      summary: 'Register new user',
      description: 'Create a new user account and return JWT access token',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'user@example.com',
            description: 'User email address',
          },
          password: {
            type: 'string',
            example: 'yourPassword123',
            description: 'User password (minimum 6 characters)',
          },
        },
        required: ['email', 'password'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User created successfully',
      type: LoginResponseDto,
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            email: 'user@example.com',
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Email already in use',
      schema: {
        example: {
          statusCode: 409,
          message: 'Email already in use',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email', 'password should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
  );
}
