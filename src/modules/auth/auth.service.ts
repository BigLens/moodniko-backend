import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };
    return this.jwtService.sign(payload);
  }

  // Placeholder for login logic
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // TODO: Implement user lookup and password validation when UserService is available
    throw new UnauthorizedException(loginDto, 'Login not implemented yet.');
  }

  //i'm leaving this guy here because it might be useful for me with debugging purposes
  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
