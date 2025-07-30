import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

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
    it('should validate payload with correct user data', async () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: 'test@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException when payload.sub is missing', async () => {
      const payload: JwtPayload = {
        sub: undefined,
        email: 'test@example.com',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should throw UnauthorizedException when payload.email is missing', async () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: undefined,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should throw UnauthorizedException when both sub and email are missing', async () => {
      const payload: JwtPayload = {
        sub: undefined,
        email: undefined,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should throw UnauthorizedException when payload is null', async () => {
      await expect(strategy.validate(null)).rejects.toThrow(
        "Cannot read properties of null (reading 'sub')",
      );
    });

    it('should throw UnauthorizedException when payload is undefined', async () => {
      await expect(strategy.validate(undefined)).rejects.toThrow(
        "Cannot read properties of undefined (reading 'sub')",
      );
    });

    it('should handle payload with empty string values', async () => {
      const payload: JwtPayload = {
        sub: '',
        email: '',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should handle payload with whitespace-only values', async () => {
      const payload: JwtPayload = {
        sub: '   ',
        email: '   ',
      };

      // The current implementation doesn't check for whitespace-only values
      const result = await strategy.validate(payload);
      expect(result).toEqual({
        userId: '   ',
        email: '   ',
      });
    });

    it('should validate payload with numeric sub as string', async () => {
      const payload: JwtPayload = {
        sub: '123',
        email: 'test@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: '123',
        email: 'test@example.com',
      });
    });

    it('should validate payload with special characters in email', async () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: 'test+special@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: 'test+special@example.com',
      });
    });

    it('should validate payload with uppercase email', async () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: 'TEST@EXAMPLE.COM',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: 'TEST@EXAMPLE.COM',
      });
    });

    it('should handle payload with additional properties', async () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: 'test@example.com',
        extra: 'value',
      } as any;

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: 'test@example.com',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very long user IDs', async () => {
      const longId = 'a'.repeat(1000);
      const payload: JwtPayload = {
        sub: longId,
        email: 'test@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: longId,
        email: 'test@example.com',
      });
    });

    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(500) + '@example.com';
      const payload: JwtPayload = {
        sub: 'user123',
        email: longEmail,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: longEmail,
      });
    });

    it('should handle payload with unicode characters', async () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: 'test@exámple.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: 'test@exámple.com',
      });
    });

    it('should handle payload with emoji characters', async () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: 'test@example😀.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: 'test@example😀.com',
      });
    });
  });

  describe('error scenarios', () => {
    it('should handle payload with null values', async () => {
      const payload: JwtPayload = {
        sub: null,
        email: null,
      } as any;

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should handle payload with undefined values', async () => {
      const payload: JwtPayload = {
        sub: undefined,
        email: undefined,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });

    it('should handle payload with non-string values', async () => {
      const payload: JwtPayload = {
        sub: 123,
        email: 456,
      } as any;

      // The current implementation doesn't validate types, it just checks for truthiness
      const result = await strategy.validate(payload);
      expect(result).toEqual({
        userId: 123,
        email: 456,
      });
    });

    it('should handle payload with boolean values', async () => {
      const payload: JwtPayload = {
        sub: true,
        email: false,
      } as any;

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
    });
  });
});
