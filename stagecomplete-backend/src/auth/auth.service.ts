import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, AuthResponseDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

      // 5. Formater la réponse (pas de JWT pour l'instant)
      return {
        access_token: 'temp_token', // À remplacer par JWT dans AUTH-004
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
}
