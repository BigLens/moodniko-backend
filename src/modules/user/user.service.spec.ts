import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUser: UserEntity = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
    moods: [],
  };

  const createUserDto: CreateUserDto = {
    email: 'newuser@example.com',
    password: 'newpassword123',
  };

  const updateUserDto: UpdateUserDto = {
    email: 'updated@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });

    it('should handle case-sensitive email search', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await service.findByEmail('TEST@EXAMPLE.COM');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'TEST@EXAMPLE.COM' },
      });
    });

    it('should handle database errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        error,
      );
    });
  });

  describe('createUser', () => {
    it('should create user successfully when email is not in use', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException when email is already in use', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new ConflictException('Email already in use'),
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when save fails', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      const saveError = new Error('Save failed');
      mockRepository.save.mockRejectedValue(saveError);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new InternalServerErrorException(saveError, 'Failed to create user'),
      );
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should handle different email formats', async () => {
      const userWithDifferentEmail = {
        ...mockUser,
        email: 'different@example.com',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(userWithDifferentEmail);
      mockRepository.save.mockResolvedValue(userWithDifferentEmail);

      const result = await service.createUser({
        email: 'different@example.com',
        password: 'password123',
      });

      expect(result.email).toBe('different@example.com');
    });

    it('should handle special characters in email', async () => {
      const userWithSpecialEmail = {
        ...mockUser,
        email: 'test+tag@example.com',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(userWithSpecialEmail);
      mockRepository.save.mockResolvedValue(userWithSpecialEmail);

      const result = await service.createUser({
        email: 'test+tag@example.com',
        password: 'password123',
      });

      expect(result.email).toBe('test+tag@example.com');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully when user exists', async () => {
      const updatedUser = {
        ...mockUser,
        email: updateUserDto.email,
        updatedAt: new Date('2024-01-15T11:00:00.000Z'),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...updateUserDto,
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUser(999, updateUserDto)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when save fails', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const saveError = new Error('Update failed');
      mockRepository.save.mockRejectedValue(saveError);

      await expect(service.updateUser(1, updateUserDto)).rejects.toThrow(
        new InternalServerErrorException(saveError, 'Failed to update user'),
      );
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto = { email: 'partial@example.com' };
      const updatedUser = {
        ...mockUser,
        email: partialUpdateDto.email,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, partialUpdateDto);

      expect(result.email).toBe(partialUpdateDto.email);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...partialUpdateDto,
      });
    });

    it('should handle multiple field updates', async () => {
      const multiFieldUpdateDto = {
        email: 'multi@example.com',
        // Add other fields if they exist in UpdateUserDto
      };

      const updatedUser = {
        ...mockUser,
        ...multiFieldUpdateDto,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, multiFieldUpdateDto);

      expect(result).toEqual(updatedUser);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...multiFieldUpdateDto,
      });
    });

    it('should handle update with same data', async () => {
      const sameDataUpdateDto = { email: mockUser.email };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.updateUser(1, sameDataUpdateDto);

      expect(result).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...sameDataUpdateDto,
      });
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors in findByEmail', async () => {
      const dbError = new Error('Connection timeout');
      mockRepository.findOne.mockRejectedValue(dbError);

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        dbError,
      );
    });

    it('should handle validation errors in createUser', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      const validationError = new Error('Validation failed');
      mockRepository.save.mockRejectedValue(validationError);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new InternalServerErrorException(
          validationError,
          'Failed to create user',
        ),
      );
    });

    it('should handle constraint violations in createUser', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      const constraintError = new Error('UNIQUE constraint failed');
      mockRepository.save.mockRejectedValue(constraintError);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new InternalServerErrorException(
          constraintError,
          'Failed to create user',
        ),
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty email in findByEmail', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: '' },
      });
    });

    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...mockUser, email: longEmail });
      mockRepository.save.mockResolvedValue({ ...mockUser, email: longEmail });

      const result = await service.createUser({
        email: longEmail,
        password: 'password123',
      });

      expect(result.email).toBe(longEmail);
    });

    it('should handle special characters in email during update', async () => {
      const specialEmail = 'test+special@example.com';
      const updatedUser = { ...mockUser, email: specialEmail };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, { email: specialEmail });

      expect(result.email).toBe(specialEmail);
    });
  });
});
