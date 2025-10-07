import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterDto,
  AuthResponseDto,
  JwtPayload,
  LoginDto,
  UpdateProfileDto,
  UpdateUserDto,
  ChangePasswordDto,
  DeleteAccountDto,
  DeleteAccountResponseDto,
} from './dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// Interface pour le payload JWT

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   *  Méthode pour enregistrer un utilisateur
   * @param registerDto
   * @returns
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, role } = registerDto;

    try {
      // 1. Vérifier si l'utilisateur existe déjà
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Un compte avec cet email existe déjà');
      }

      console.log(registerDto);
      // 2. Hash du mot de passe
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 3. Créer l'utilisateur avec son profil dans une transaction
      const userWithProfile = await this.prisma.$transaction(async (prisma) => {
        // Créer l'utilisateur
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
          },
        });

        // Créer le profil lié
        const newProfile = await prisma.profile.create({
          data: {
            userId: newUser.id,
            name: name,
            // Initialiser selon le rôle
            bio:
              role === 'ARTIST'
                ? 'Nouvel artiste sur StageComplete'
                : 'Nouvelle venue sur StageComplete',
          },
        });

        // Créer l'extension selon le rôle
        if (role === 'ARTIST') {
          await prisma.artist.create({
            data: {
              profileId: newProfile.id,
              genres: [], // Array vide par défaut
              instruments: [],
              experience: 'BEGINNER',
              priceRange: '100-500',
            },
          });
        } else if (role === 'VENUE') {
          await prisma.venue.create({
            data: {
              profileId: newProfile.id,
              capacity: null, // À remplir plus tard
              venueType: 'BAR', // Par défaut
              equipment: [],
              amenities: [],
              priceRange: '100-500',
            },
          });
        }

        return { user: newUser, profile: newProfile };
      });

      // 4. Récupérer l'utilisateur complet pour la réponse
      const completeUser = await this.prisma.user.findUnique({
        where: { id: userWithProfile.user.id },
        include: {
          profile: {
            include: {
              artist: true,
              venue: true,
            },
          },
        },
      });

      // Vérifier que l'utilisateur existe (sécurité supplémentaire)
      if (!completeUser || !completeUser.profile) {
        throw new InternalServerErrorException(
          'Erreur lors de la récupération du compte créé',
        );
      }

      // 5. Générer le JWT token
      const token = await this.generateJwtToken({
        sub: completeUser.id,
        email: completeUser.email,
        role: completeUser.role,
      });

      // 6. Formater la réponse (pas de JWT pour l'instant)
      return {
        access_token: token, // À remplacer par JWT dans AUTH-004
        user: {
          id: completeUser.id,
          email: completeUser.email,
          role: completeUser.role,
          profile: {
            id: completeUser.profile.id,
            name: completeUser.profile.name || 'Utilisateur',
            bio: completeUser.profile.bio ?? undefined,
            avatar: completeUser.profile.avatar ?? undefined,
            location: completeUser.profile.location ?? undefined,
            website: completeUser.profile.website ?? undefined,
            socialLinks: completeUser.profile.socialLinks,
            createdAt: completeUser.profile.createdAt,
            updatedAt: completeUser.profile.updatedAt,
          },
          createdAt: completeUser.createdAt,
          updatedAt: completeUser.updatedAt,
        },
        message: 'Compte créé avec succès ! Bienvenue sur StageComplete.',
      };
    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error instanceof ConflictException) {
        throw error;
      }

      // Log de l'erreur pour debugging
      console.error('Erreur lors de la création du compte:', error);

      // Erreur générique pour l'utilisateur
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du compte. Veuillez réessayer.',
      );
    }
  }

  /**
   * Méthode pour se connecter un utilisateur
   * @param loginDto
   * @returns
   * @throws UnauthorizedException
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    try {
      // 1. Chercher l'utilisateur par email avec toutes ses relations
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          profile: {
            include: {
              artist: true,
              venue: true,
            },
          },
        },
      });

      // 2. Vérifier que l'utilisateur existe
      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // 3. Vérifier le mot de passe
      const isPasswordValid = await this.verifyPassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // 4. Vérifier que l'utilisateur a un profil
      if (!user.profile) {
        throw new InternalServerErrorException(
          'Profil utilisateur introuvable',
        );
      }

      // 5. Générer le JWT token
      const token = await this.generateJwtToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      // 6. Retourner la réponse avec token et informations utilisateur
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: {
            id: user.profile.id,
            name: user.profile.name || 'Utilisateur',
            bio: user.profile.bio ?? undefined,
            avatar: user.profile.avatar ?? undefined,
            location: user.profile.location ?? undefined,
            website: user.profile.website ?? undefined,
            socialLinks: user.profile.socialLinks,
            createdAt: user.profile.createdAt,
            updatedAt: user.profile.updatedAt,
          },
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        message: `Bienvenue ${user.profile.name} ! Connexion réussie.`,
      };
    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log de l'erreur pour debugging
      console.error('Erreur lors de la connexion:', error);

      // Erreur générique pour l'utilisateur (ne pas leak d'infos)
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la connexion. Veuillez réessayer.',
      );
    }
  }

  // ==========  MÉTHODES JWT ==========

  /**
   * Génère un token JWT pour un utilisateur
   */
  async generateJwtToken(
    payload: Omit<JwtPayload, 'iat' | 'exp'>,
  ): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * Vérifie et decode un token JWT
   */
  async verifyJwtToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  /**
   * Génère un refresh token (durée plus longue)
   */
  async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, type: 'refresh' },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' },
    );
  }

  /**
   * Récupère un utilisateur depuis un token JWT
   */
  async getUserFromToken(token: string) {
    try {
      const payload = await this.verifyJwtToken(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          profile: {
            include: {
              artist: true,
              venue: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  // Méthode utilitaire pour vérifier si un email existe
  async emailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  // Méthode utilitaire pour le hash (pour les tests)
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Méthode utilitaire pour vérifier un mot de passe
  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Méthode pour trouver un utilisateur par ID (pour JWT strategy)
  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            artist: true,
            venue: true,
          },
        },
      },
    });
  }

  // Méthode pour mettre à jour le profil utilisateur (version simplifiée)
  async updateUserProfile(userId: string, updateData: UpdateProfileDto) {
    try {
      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (!user.profile) {
        throw new NotFoundException('Profil non trouvé');
      }

      // Préparer les données pour la mise à jour
      const updateFields: any = {
        updatedAt: new Date(),
      };

      // Copier les champs simples
      if (updateData.name !== undefined) updateFields.name = updateData.name;
      if (updateData.bio !== undefined) updateFields.bio = updateData.bio;
      if (updateData.avatar !== undefined)
        updateFields.avatar = updateData.avatar;
      if (updateData.location !== undefined)
        updateFields.location = updateData.location;
      if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
      if (updateData.website !== undefined)
        updateFields.website = updateData.website;

      // Gérer socialLinks (conversion JSON)
      if (updateData.socialLinks !== undefined) {
        updateFields.socialLinks = updateData.socialLinks;
      }

      // Mettre à jour le profil
      await this.prisma.profile.update({
        where: { id: user.profile.id },
        data: updateFields,
      });

      // Retourner l'utilisateur complet mis à jour
      const updatedUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              artist: true,
              venue: true,
            },
          },
        },
      });

      return updatedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erreur lors de la mise à jour du profil:', error);
      throw new BadRequestException('Erreur lors de la mise à jour du profil');
    }
  }

  // ==========  MÉTHODES PROFIL ARTISTE ÉTENDU ==========

  /**
   * Récupère un profil artiste public par slug ou ID
   */
  async getPublicArtistProfile(identifier: string) {
    // Essayer d'abord par slug, puis par ID
    const artist = await this.prisma.artist.findFirst({
      where: {
        AND: [
          { isPublic: true },
          {
            OR: [{ publicSlug: identifier }, { id: identifier }],
          },
        ],
      },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                email: false, // Ne pas exposer l'email
                role: true,
                createdAt: true,
              },
            },
          },
        },
        members: {
          orderBy: [{ isFounder: 'desc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!artist) {
      throw new NotFoundException(
        'Profil artiste public non trouvé ou non visible',
      );
    }

    return artist;
  }

  /**
   * Recherche d'artistes avec filtres pour les venues
   */
  async searchArtists(filters: {
    genres?: string[];
    experience?: string;
    priceRange?: string;
    location?: string;
    instruments?: string[];
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const {
      genres,
      experience,
      priceRange,
      location,
      instruments,
      isPublic = true,
      limit = 20,
      offset = 0,
    } = filters;

    const whereConditions: any = {
      isPublic,
    };

    // Filtres par genres
    if (genres && genres.length > 0) {
      whereConditions.genres = {
        hasSome: genres,
      };
    }

    // Filtre par expérience
    if (experience) {
      whereConditions.experience = experience;
    }

    // Filtre par fourchette de prix
    if (priceRange) {
      whereConditions.priceRange = priceRange;
    }

    // Filtre par instruments
    if (instruments && instruments.length > 0) {
      whereConditions.instruments = {
        hasSome: instruments,
      };
    }

    // Filtre par localisation (via le profil)
    const profileFilter: any = {};
    if (location) {
      profileFilter.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    // Construire la clause where complète si nécessaire
    if (Object.keys(profileFilter).length > 0) {
      whereConditions.profile = profileFilter;
    }

    const artists = await this.prisma.artist.findMany({
      where: whereConditions,
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                role: true,
                createdAt: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Compter le total pour la pagination
    const total = await this.prisma.artist.count({
      where: whereConditions,
    });

    return {
      artists,
      total,
      hasMore: offset + limit < total,
    };
  }

  // ==========  MÉTHODES USER MANAGEMENT ==========

  /**
   * Récupérer les informations personnelles de l'utilisateur connecté
   */
  async getUserInfo(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isFounder: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              id: true,
              name: true,
              avatar: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        'Erreur lors de la récupération des informations utilisateur:',
        error,
      );
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des informations utilisateur',
      );
    }
  }

  /**
   * Mettre à jour les informations personnelles de l'utilisateur
   */
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    try {
      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Vérifier l'unicité de l'email si modifié
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: updateUserDto.email },
        });

        if (existingUser) {
          throw new ConflictException('Un compte avec cet email existe déjà');
        }
      }

      // Préparer les données de mise à jour
      const updateFields: any = {
        updatedAt: new Date(),
      };

      if (updateUserDto.firstName !== undefined)
        updateFields.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName !== undefined)
        updateFields.lastName = updateUserDto.lastName;
      if (updateUserDto.email !== undefined)
        updateFields.email = updateUserDto.email;
      if (updateUserDto.phone !== undefined)
        updateFields.phone = updateUserDto.phone;
      if (updateUserDto.isFounder !== undefined)
        updateFields.isFounder = updateUserDto.isFounder;

      // Mettre à jour l'utilisateur
      await this.prisma.user.update({
        where: { id: userId },
        data: updateFields,
      });

      // Retourner les informations mises à jour
      return await this.getUserInfo(userId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      throw new BadRequestException(
        'Erreur lors de la mise à jour des informations utilisateur',
      );
    }
  }

  /**
   * Changer le mot de passe de l'utilisateur
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      // Récupérer l'utilisateur avec le mot de passe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Vérifier l'ancien mot de passe
      const isCurrentPasswordValid = await this.verifyPassword(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Mot de passe actuel incorrect');
      }

      // Vérifier que le nouveau mot de passe est différent
      const isSamePassword = await this.verifyPassword(
        changePasswordDto.newPassword,
        user.password,
      );

      if (isSamePassword) {
        throw new BadRequestException(
          "Le nouveau mot de passe doit être différent de l'actuel",
        );
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await this.hashPassword(
        changePasswordDto.newPassword,
      );

      // Mettre à jour le mot de passe
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      });

      return {
        message: 'Mot de passe modifié avec succès',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erreur lors du changement de mot de passe:', error);
      throw new InternalServerErrorException(
        'Erreur lors du changement de mot de passe',
      );
    }
  }

  /**
   * Supprimer le compte utilisateur et toutes ses données associées
   */
  async deleteAccount(
    userId: string,
    deleteAccountDto: DeleteAccountDto,
  ): Promise<DeleteAccountResponseDto> {
    try {
      // Récupérer l'utilisateur avec le mot de passe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          password: true,
          email: true,
          profile: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await this.verifyPassword(
        deleteAccountDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }

      // Log de l'action pour audit
      console.log(
        `Suppression du compte utilisateur: ${user.email} (${user.profile?.name || 'N/A'}) - ${new Date().toISOString()}`,
      );

      // Supprimer l'utilisateur (cascade automatique via Prisma)
      // Les relations suivantes seront supprimées automatiquement :
      // - Profile (et par cascade Artist/Venue)
      // - ArtistMember
      // - Messages
      // - Événements
      const deletedAt = new Date();

      await this.prisma.user.delete({
        where: { id: userId },
      });

      return {
        message: 'Votre compte a été supprimé avec succès',
        deletedAt: deletedAt.toISOString(),
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      console.error('Erreur lors de la suppression du compte:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du compte',
      );
    }
  }
}
