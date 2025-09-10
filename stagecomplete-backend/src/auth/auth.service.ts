import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, AuthResponseDto, JwtPayload } from './dto';
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
}
