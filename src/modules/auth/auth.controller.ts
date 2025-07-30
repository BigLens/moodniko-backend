import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDoc } from './docs/login.doc';
import { RegisterDoc } from './docs/register.doc';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDoc()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @RegisterDoc()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.register(createUserDto);
  }
}
