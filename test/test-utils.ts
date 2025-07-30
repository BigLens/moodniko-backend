import { JwtService } from '@nestjs/jwt';

export interface MockUser {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  moods: any[];
}

export interface MockJwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class TestAuthUtils {
  private static readonly TEST_JWT_SECRET = 'test-secret-key';
  private static readonly TEST_JWT_EXPIRES_IN = '1h';

  /**
   * Create a mock user for testing
   */
  static createMockUser(overrides: Partial<MockUser> = {}): MockUser {
    return {
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password-123',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      moods: [],
      ...overrides,
    };
  }

  /**
   * Create a mock JWT payload
   */
  static createMockJwtPayload(
    overrides: Partial<MockJwtPayload> = {},
  ): MockJwtPayload {
    return {
      sub: '1',
      email: 'test@example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...overrides,
    };
  }

  /**
   * Generate a valid JWT token for testing
   */
  static generateValidToken(
    userId: number = 1,
    email: string = 'test@example.com',
  ): string {
    const jwtService = new JwtService({
      secret: this.TEST_JWT_SECRET,
      signOptions: { expiresIn: this.TEST_JWT_EXPIRES_IN },
    });

    return jwtService.sign({
      sub: userId.toString(),
      email,
    });
  }

  /**
   * Generate an expired JWT token for testing
   */
  static generateExpiredToken(
    userId: number = 1,
    email: string = 'test@example.com',
  ): string {
    const jwtService = new JwtService({
      secret: this.TEST_JWT_SECRET,
      signOptions: { expiresIn: '1ms' },
    });

    return jwtService.sign({
      sub: userId.toString(),
      email,
    });
  }

  /**
   * Generate an invalid JWT token for testing
   */
  static generateInvalidToken(): string {
    return 'invalid.jwt.token';
  }

  /**
   * Create mock user data for different scenarios
   */
  static getMockUsers() {
    return {
      regular: this.createMockUser({
        id: 1,
        email: 'user1@example.com',
      }),
      admin: this.createMockUser({
        id: 2,
        email: 'admin@example.com',
      }),
      premium: this.createMockUser({
        id: 3,
        email: 'premium@example.com',
      }),
      inactive: this.createMockUser({
        id: 4,
        email: 'inactive@example.com',
      }),
    };
  }

  /**
   * Create mock JWT payloads for different scenarios
   */
  static getMockJwtPayloads() {
    return {
      regular: this.createMockJwtPayload({
        sub: '1',
        email: 'user1@example.com',
      }),
      admin: this.createMockJwtPayload({
        sub: '2',
        email: 'admin@example.com',
      }),
      premium: this.createMockJwtPayload({
        sub: '3',
        email: 'premium@example.com',
      }),
      expired: this.createMockJwtPayload({
        sub: '1',
        email: 'user1@example.com',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      }),
      invalid: {
        sub: null,
        email: null,
      } as any,
    };
  }

  /**
   * Create authentication headers for testing
   */
  static createAuthHeaders(token: string = this.generateValidToken()) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Create request context with user for testing
   */
  static createRequestContext(user: MockUser = this.createMockUser()) {
    return {
      user: {
        userId: user.id.toString(),
        email: user.email,
      },
    };
  }

  /**
   * Create execution context with authentication for testing
   */
  static createExecutionContext(
    user: MockUser = this.createMockUser(),
    token: string = this.generateValidToken(user.id, user.email),
  ) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: this.createAuthHeaders(token),
          user: {
            userId: user.id.toString(),
            email: user.email,
          },
        }),
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        }),
      }),
    };
  }

  /**
   * Create mock JWT service for testing
   */
  static createMockJwtService() {
    return {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
      verify: jest.fn().mockImplementation((token: string) => {
        if (token === 'mock.jwt.token') {
          return this.createMockJwtPayload();
        }
        throw new Error('Invalid token');
      }),
      decode: jest.fn().mockReturnValue(this.createMockJwtPayload()),
    };
  }

  /**
   * Create mock user service for testing
   */
  static createMockUserService() {
    const mockUser = this.createMockUser();
    return {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      createUser: jest.fn().mockResolvedValue(mockUser),
      updateUser: jest.fn().mockResolvedValue(mockUser),
    };
  }

  /**
   * Create mock config service for testing
   */
  static createMockConfigService() {
    return {
      get: jest.fn().mockImplementation((key: string) => {
        const config = {
          'jwt.secret': 'test-secret-key',
          'jwt.expiresIn': '1h',
          'database.host': 'localhost',
          'database.port': 5432,
          'database.username': 'test',
          'database.password': 'test',
          'database.database': 'test_db',
        };
        return config[key];
      }),
    };
  }
}

/**
 * Test data constants
 */
export const TEST_USERS = {
  USER_1: {
    id: 1,
    email: 'user1@example.com',
    password: 'password123',
  },
  USER_2: {
    id: 2,
    email: 'user2@example.com',
    password: 'password456',
  },
  ADMIN: {
    id: 3,
    email: 'admin@example.com',
    password: 'admin123',
  },
};

export const TEST_TOKENS = {
  VALID: TestAuthUtils.generateValidToken(),
  EXPIRED: TestAuthUtils.generateExpiredToken(),
  INVALID: 'invalid.token.here',
  MALFORMED: 'not.a.valid.jwt',
};

export const TEST_PAYLOADS = {
  VALID: TestAuthUtils.createMockJwtPayload(),
  EXPIRED: TestAuthUtils.createMockJwtPayload({
    exp: Math.floor(Date.now() / 1000) - 3600,
  }),
  INVALID: {
    sub: null,
    email: null,
  } as any,
  MISSING_SUB: {
    email: 'test@example.com',
  } as any,
  MISSING_EMAIL: {
    sub: '1',
  } as any,
};
