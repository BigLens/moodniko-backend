import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    decode: jest
      .fn()
      .mockReturnValue({ sub: 'user123', email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
          },
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
