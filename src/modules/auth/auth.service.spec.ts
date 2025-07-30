import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { comparePassword, hashPassword } from '../user/utils/password.util';

// Mock the password utility functions
jest.mock('../user/utils/password.util', () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

// Get the mocked functions with proper typing
const mockedComparePassword = jest.mocked(comparePassword);
const mockedHashPassword = jest.mocked(hashPassword);

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
    decode: jest
      .fn()
      .mockReturnValue({ sub: 'user123', email: 'test@example.com' }),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockUser: UserEntity = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
    moods: [],
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
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a JWT token with correct payload', () => {
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
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('should generate different tokens for different users', () => {
      const user1 = { userId: 'user1', email: 'user1@example.com' };
      const user2 = { userId: 'user2', email: 'user2@example.com' };

      mockJwtService.sign
        .mockReturnValueOnce('token1')
        .mockReturnValueOnce('token2');

      const token1 = service.generateToken(user1.userId, user1.email);
      const token2 = service.generateToken(user2.userId, user2.email);

      expect(token1).toBe('token1');
      expect(token2).toBe('token2');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
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

    it('should handle invalid token gracefully', () => {
      const token = 'invalid.token';
      mockJwtService.decode.mockReturnValue(null);

      const result = service.decodeToken(token);

      expect(result).toBeNull();
      expect(jwtService.decode).toHaveBeenCalledWith(token);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      const mockUserWithHashedPassword = {
        ...mockUser,
        password: '$2b$10$hashedPassword', // Mock hashed password
      };

      mockUserService.findByEmail.mockResolvedValue(mockUserWithHashedPassword);

      // Mock the password comparison to return true
      mockedComparePassword.mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'mock.jwt.token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      });
      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id.toString(),
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      // Mock the password comparison to return false
      mockedComparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle login with different email cases', async () => {
      const loginDtoUpperCase = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);

      mockedComparePassword.mockResolvedValue(true);

      await service.login(loginDtoUpperCase);

      expect(userService.findByEmail).toHaveBeenCalledWith('TEST@EXAMPLE.COM');
    });
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'newpassword123',
    };

    it('should successfully register a new user', async () => {
      const newUser = {
        ...mockUser,
        id: 2,
        email: createUserDto.email,
      };

      mockUserService.createUser.mockResolvedValue(newUser);

      // Mock the password hashing
      mockedHashPassword.mockResolvedValue('hashed-password-123');

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        accessToken: 'mock.jwt.token',
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      });

      expect(userService.createUser).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: 'hashed-password-123', // Should be hashed
      });
    });

    it('should handle registration errors from user service', async () => {
      const error = new Error('Database error');
      mockUserService.createUser.mockRejectedValue(error);

      await expect(service.register(createUserDto)).rejects.toThrow(error);
      expect(userService.createUser).toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle JWT service errors gracefully', async () => {
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      expect(() =>
        service.generateToken('user123', 'test@example.com'),
      ).toThrow('JWT signing failed');
    });

    it('should handle user service errors in login', async () => {
      const error = new Error('Database connection failed');
      mockUserService.findByEmail.mockRejectedValue(error);

      await expect(
        service.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(error);
    });
  });
});
