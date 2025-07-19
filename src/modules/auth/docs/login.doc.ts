import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

export function LoginDoc() {
  return applyDecorators(
    ApiTags('auth'),
    ApiOperation({ summary: 'User login' }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      type: LoginResponseDto,
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}
