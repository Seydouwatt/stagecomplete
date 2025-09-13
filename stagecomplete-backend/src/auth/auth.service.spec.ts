import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    profile: {
      create: jest.fn(),
    },
    artist: {
      create: jest.fn(),
    },
    venue: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockRegisterDto = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'John Doe',
      role: Role.ARTIST,
    };

    it('should successfully register a new artist', async () => {
      // Setup mocks
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: Role.ARTIST,
      };
      const mockProfile = { id: '1', userId: '1', name: 'John Doe' };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });

      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockPrismaService.profile.create.mockResolvedValue(mockProfile);
      mockPrismaService.artist.create.mockResolvedValue({});

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          ...mockUser,
          profile: { ...mockProfile, artist: {}, venue: null },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      // Execute
      const result = await service.register(mockRegisterDto);

      // Assertions
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe(Role.ARTIST);
      expect(result.message).toContain('Compte créé avec succès');
    });

    it('should throw ConflictException if email already exists', async () => {
      // Setup: Email déjà existant
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
      });

      // Execute & Assert
      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        'Un compte avec cet email existe déjà',
      );
    });

    it('should hash password with correct salt rounds', async () => {
      // Setup
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return {
          user: { id: '1', email: 'test@example.com' },
          profile: { id: '1', name: 'John Doe' },
        };
      });

      // Mock pour le findUnique final
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: '1',
          email: 'test@example.com',
          role: Role.ARTIST,
          profile: {
            id: '1',
            name: 'John Doe',
            bio: 'Bio test',
            avatar: null,
            location: null,
            website: null,
            socialLinks: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            artist: {},
            venue: null,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      // Execute
      await service.register(mockRegisterDto);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('Password123!', 12);
    });
  });

  // Ajouter après les tests register existants

  describe('login', () => {
    const mockLoginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: Role.ARTIST,
      profile: {
        id: '1',
        name: 'John Doe',
        bio: 'Artist bio',
        avatar: null,
        location: null,
        website: null,
        socialLinks: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        artist: {},
        venue: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully login with valid credentials', async () => {
      // Setup mocks
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      service.generateJwtToken = jest.fn().mockResolvedValue('jwt-token');

      // Execute
      const result = await service.login(mockLoginDto);

      // Assertions
      expect(result).toHaveProperty('access_token', 'jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe(Role.ARTIST);
      expect(result.message).toContain('Bienvenue');
      expect(result.message).toContain('John Doe');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Setup: Utilisateur n'existe pas
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Execute & Assert
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Setup: Utilisateur existe mais mauvais mot de passe
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Execute & Assert
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );
    });

    it('should call password verification with correct parameters', async () => {
      // Setup
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      service.generateJwtToken = jest.fn().mockResolvedValue('jwt-token');

      // Execute
      await service.login(mockLoginDto);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'Password123!',
        'hashedPassword',
      );
    });

    it('should generate JWT token with correct payload', async () => {
      // Setup
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      const generateTokenSpy = jest
        .spyOn(service, 'generateJwtToken')
        .mockResolvedValue('jwt-token');

      // Execute
      await service.login(mockLoginDto);

      // Assert
      expect(generateTokenSpy).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@example.com',
        role: Role.ARTIST,
      });
    });

    it('should throw InternalServerErrorException if user has no profile', async () => {
      // Setup: Utilisateur sans profil
      const userWithoutProfile = {
        ...mockUser,
        profile: null,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(userWithoutProfile);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Execute & Assert
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('emailExists', () => {
    it('should return true if email exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      const result = await service.emailExists('test@example.com');

      expect(result).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.emailExists('nonexistent@example.com');

      expect(result).toBe(false);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyPassword('password', 'hashedPassword');

      expect(result).toBe(true);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
    });

    it('should return false for incorrect password', async () => {
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyPassword(
        'wrongpassword',
        'hashedPassword',
      );

      expect(result).toBe(false);
    });
  });
});
