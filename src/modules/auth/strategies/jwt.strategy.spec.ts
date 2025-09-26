import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserEntity } from '@modules/user/entity/user.entity';

// Mock user repository
const mockUserRepository = {
  findOneBy: jest.fn(),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret-key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return user when payload is correct', async () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@example.com',
      };

      const mockUser = { id: 1, email: 'test@example.com' } as UserEntity;
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: +payload.sub,
      });
    });

    it('should throw UnauthorizedException when payload.sub is missing', async () => {
      const payload = {
        sub: undefined,
        email: 'test@example.com',
      } as JwtPayload;

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should throw UnauthorizedException when payload.email is missing', async () => {
      const payload = { sub: '1', email: undefined } as JwtPayload;

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@example.com',
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });
  });
});
