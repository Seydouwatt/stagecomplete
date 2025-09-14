import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, AuthResponseDto, JwtPayload, LoginDto, UpdateProfileDto, UpdateArtistProfileDto } from './dto';
import { CreateArtistMemberDto, UpdateArtistMemberDto } from './dto/artist-member.dto';
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
            name,
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
            name: completeUser.profile.name,
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
            name: user.profile.name,
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
      if (updateData.avatar !== undefined) updateFields.avatar = updateData.avatar;
      if (updateData.location !== undefined) updateFields.location = updateData.location;
      if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
      if (updateData.website !== undefined) updateFields.website = updateData.website;
      
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
      throw new BadRequestException(
        'Erreur lors de la mise à jour du profil',
      );
    }
  }

  // ==========  MÉTHODES PROFIL ARTISTE ÉTENDU ==========

  /**
   * Met à jour le profil artiste étendu
   */
  async updateArtistProfile(userId: string, updateData: UpdateArtistProfileDto) {
    try {
      // Vérifier que l'utilisateur existe et est un artiste
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { 
          profile: {
            include: {
              artist: true
            }
          }
        },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (!user.profile) {
        throw new NotFoundException('Profil non trouvé');
      }

      if (user.role !== 'ARTIST') {
        throw new BadRequestException('Cette fonction n\'est disponible que pour les artistes');
      }

      // Préparer les données pour la mise à jour
      const updateFields: any = {
        updatedAt: new Date(),
      };

      // Copier tous les champs du DTO vers les champs de mise à jour
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          updateFields[key] = updateData[key];
        }
      });

      let artistProfile;

      if (user.profile.artist) {
        // Mettre à jour le profil artiste existant
        artistProfile = await this.prisma.artist.update({
          where: { profileId: user.profile.id },
          data: updateFields,
        });
      } else {
        // Créer un nouveau profil artiste
        artistProfile = await this.prisma.artist.create({
          data: {
            profileId: user.profile.id,
            ...updateFields,
          },
        });
      }

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

      console.error('Erreur lors de la mise à jour du profil artiste:', error);
      throw new BadRequestException(
        'Erreur lors de la mise à jour du profil artiste',
      );
    }
  }

  /**
   * Récupère le profil artiste complet pour un utilisateur
   */
  async getArtistProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            artist: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.role !== 'ARTIST') {
      throw new BadRequestException('Cette fonction n\'est disponible que pour les artistes');
    }

    return user;
  }

  /**
   * Récupère un profil artiste public par slug ou ID
   */
  async getPublicArtistProfile(identifier: string) {
    // Essayer d'abord par slug, puis par ID
    let artist = await this.prisma.artist.findFirst({
      where: {
        AND: [
          { isPublic: true },
          {
            OR: [
              { publicSlug: identifier },
              { id: identifier }
            ]
          }
        ]
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
              }
            }
          }
        }
      },
    });

    if (!artist) {
      throw new NotFoundException('Profil artiste public non trouvé ou non visible');
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
      offset = 0
    } = filters;

    const whereConditions: any = {
      isPublic,
    };

    // Filtres par genres
    if (genres && genres.length > 0) {
      whereConditions.genres = {
        hasSome: genres
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
        hasSome: instruments
      };
    }

    // Filtre par localisation (via le profil)
    const profileFilter: any = {};
    if (location) {
      profileFilter.location = {
        contains: location,
        mode: 'insensitive'
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
              }
            }
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Compter le total pour la pagination
    const total = await this.prisma.artist.count({
      where: whereConditions,
    });

    return {
      artists,
      total,
      hasMore: offset + limit < total
    };
  }

  /**
   * Génère un slug unique pour un artiste
   */
  async generateUniqueSlug(baseName: string): Promise<string> {
    // Nettoyer le nom pour créer un slug
    let slug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Éviter tirets multiples
      .trim();

    // Vérifier si le slug existe déjà
    let uniqueSlug = slug;
    let counter = 1;

    while (await this.prisma.artist.findFirst({ where: { publicSlug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  // ===============================
  // ARTIST MEMBER MANAGEMENT
  // ===============================

  /**
   * Créer un nouveau membre pour un artiste
   */
  async createArtistMember(artistId: string, memberData: CreateArtistMemberDto) {
    try {
      // Vérifier que l'artiste existe
      const artist = await this.prisma.artist.findUnique({
        where: { id: artistId },
        include: { members: true }
      });

      if (!artist) {
        throw new NotFoundException('Artiste non trouvé');
      }

      // Vérifier que le nombre de membres ne dépasse pas la limite
      if (artist.members.length >= artist.memberCount) {
        throw new BadRequestException(`Le nombre maximum de membres (${artist.memberCount}) est atteint`);
      }

      // Créer le membre
      const newMember = await this.prisma.artistMember.create({
        data: {
          artistId,
          ...memberData
        }
      });

      return newMember;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création du membre');
    }
  }

  /**
   * Récupérer tous les membres d'un artiste
   */
  async getArtistMembers(artistId: string) {
    try {
      const artist = await this.prisma.artist.findUnique({
        where: { id: artistId },
        include: { 
          members: {
            where: { isActive: true },
            orderBy: [
              { isFounder: 'desc' },
              { joinDate: 'asc' }
            ]
          }
        }
      });

      if (!artist) {
        throw new NotFoundException('Artiste non trouvé');
      }

      return {
        artist: {
          id: artist.id,
          artistType: artist.artistType,
          memberCount: artist.memberCount
        },
        members: artist.members
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération des membres');
    }
  }

  /**
   * Mettre à jour un membre
   */
  async updateArtistMember(artistId: string, memberId: string, updateData: UpdateArtistMemberDto) {
    try {
      // Vérifier que le membre appartient bien à cet artiste
      const member = await this.prisma.artistMember.findFirst({
        where: { 
          id: memberId,
          artistId: artistId 
        }
      });

      if (!member) {
        throw new NotFoundException('Membre non trouvé');
      }

      // Mettre à jour le membre
      const updatedMember = await this.prisma.artistMember.update({
        where: { id: memberId },
        data: updateData
      });

      return updatedMember;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la mise à jour du membre');
    }
  }

  /**
   * Supprimer un membre (soft delete en désactivant)
   */
  async deleteArtistMember(artistId: string, memberId: string) {
    try {
      // Vérifier que le membre appartient bien à cet artiste
      const member = await this.prisma.artistMember.findFirst({
        where: { 
          id: memberId,
          artistId: artistId 
        }
      });

      if (!member) {
        throw new NotFoundException('Membre non trouvé');
      }

      // Soft delete : désactiver le membre au lieu de le supprimer
      await this.prisma.artistMember.update({
        where: { id: memberId },
        data: { isActive: false }
      });

      return { message: 'Membre supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la suppression du membre');
    }
  }

  /**
   * Récupérer un membre spécifique
   */
  async getArtistMember(artistId: string, memberId: string) {
    try {
      const member = await this.prisma.artistMember.findFirst({
        where: { 
          id: memberId,
          artistId: artistId,
          isActive: true
        }
      });

      if (!member) {
        throw new NotFoundException('Membre non trouvé');
      }

      return member;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération du membre');
    }
  }

  /**
   * Initialiser automatiquement le premier membre pour un artiste solo
   */
  async initializeSoloArtistMember(artistId: string, userProfile: any) {
    try {
      // Vérifier si l'artiste a déjà des membres
      const existingMembers = await this.prisma.artistMember.count({
        where: { artistId, isActive: true }
      });

      if (existingMembers > 0) {
        return; // Déjà initialisé
      }

      // Créer le membre principal pour l'artiste solo
      await this.prisma.artistMember.create({
        data: {
          artistId,
          name: userProfile.name,
          email: userProfile.user?.email,
          avatar: userProfile.avatar,
          phone: userProfile.phone,
          bio: userProfile.bio,
          isFounder: true,
          isActive: true,
          instruments: [], // À remplir manuellement par l'utilisateur
          role: 'Artiste principal'
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du membre solo:', error);
      // Ne pas lancer d'erreur pour ne pas bloquer la création du profil
    }
  }
}
