import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

export function LoginDoc() {
  return applyDecorators(
    ApiTags('auth'),
    ApiOperation({ summary: 'User login' }),
    ApiBody({
      schema: {
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'yourPassword123' },
        },
        required: ['email', 'password'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      type: LoginResponseDto,
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}
