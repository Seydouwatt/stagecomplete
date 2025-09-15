import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!user.profile) {
      throw new NotFoundException('Profil non trouvé');
    }

    return {
      message: 'Profil récupéré avec succès',
      profile: user.profile
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!user.profile) {
      throw new BadRequestException('Profil non trouvé');
    }

    // Préparation des données avec conversion des types JSON
    const {
      socialLinks,
      ...restData
    } = updateProfileDto;

    const profileData = {
      ...restData,
      // Conversion explicite des types JSON pour Prisma
      socialLinks: socialLinks as any,
    };

    try {
      const updatedProfile = await this.prisma.profile.update({
        where: { id: user.profile.id },
        data: profileData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      });

      return {
        message: 'Profil mis à jour avec succès',
        profile: updatedProfile
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw new BadRequestException('Erreur lors de la mise à jour du profil');
    }
  }

  async getProfileCompletion(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });

    if (!user || !user.profile) {
      return { completion: 0, missingFields: [] };
    }

    const profile = user.profile;
    const fields = {
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar,
      phone: profile.phone,
      location: profile.location,
      website: profile.website,
      socialLinks: profile.socialLinks
    };

    const filledFields = Object.entries(fields).filter(([key, value]) => {
      if (key === 'socialLinks') {
        return value && typeof value === 'object' && Object.keys(value).length > 0;
      }
      return value && String(value).trim() !== '';
    });

    const completion = Math.round((filledFields.length / Object.keys(fields).length) * 100);
    const missingFields = Object.entries(fields)
      .filter(([key, value]) => {
        if (key === 'socialLinks') {
          return !value || typeof value !== 'object' || Object.keys(value).length === 0;
        }
        return !value || String(value).trim() === '';
      })
      .map(([key]) => key);

    return {
      completion,
      missingFields,
      totalFields: Object.keys(fields).length,
      filledFields: filledFields.length
    };
  }
}