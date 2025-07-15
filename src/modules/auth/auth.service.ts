import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

  //i'm leaving this guy here because it might be useful for me with debugging purposes
  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
