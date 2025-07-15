import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const userId = 'user123';
      const email = 'test@example.com';
      const expectedToken = 'mock.jwt.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateToken(userId, email);

      expect(result).toBe(expectedToken);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userId,
        email: email,
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode a JWT token', () => {
      const token = 'mock.jwt.token';
      const expectedPayload = {
        sub: 'user123',
        email: 'test@example.com',
      };

      mockJwtService.decode.mockReturnValue(expectedPayload);

      const result = service.decodeToken(token);

      expect(result).toEqual(expectedPayload);
      expect(jwtService.decode).toHaveBeenCalledWith(token);
    });
  });
});
