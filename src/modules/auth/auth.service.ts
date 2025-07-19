import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserService } from '@modules/user/user.service';
import {
  comparePassword,
  hashPassword,
} from '@modules/user/utils/password.util';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await comparePassword(loginDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateToken(user.id.toString(), user.email);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const accessToken = this.generateToken(user.id.toString(), user.email);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
