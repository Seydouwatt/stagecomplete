import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateArtistProfileDto,
  CreateArtistMemberDto,
  UpdateArtistMemberDto,
  ArtistType
} from '../common/dto';
import { generateUniqueSlug } from '../common/utils';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getArtistProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            artist: {
              include: {
                members: {
                  where: { isActive: true },
                  orderBy: { createdAt: 'asc' }
                }
              }
            }
          }
        }
      }
    });

    if (!user || user.role !== 'ARTIST') {
      throw new NotFoundException('Utilisateur artiste non trouvé');
    }

    return user.profile?.artist;
  }

  async updateArtistProfile(userId: string, updateArtistProfileDto: UpdateArtistProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: { artist: true }
        }
      }
    });

    if (!user || user.role !== 'ARTIST') {
      throw new BadRequestException('Utilisateur non trouvé ou non artiste');
    }

    if (!user.profile) {
      throw new BadRequestException('Profil utilisateur non trouvé');
    }

    // Préparation des données avec conversion des types JSON
    const {
      priceDetails,
      socialLinks,
      portfolio,
      ...restData
    } = updateArtistProfileDto;

    const artistData = {
      ...restData,
      // Conversion explicite des types JSON pour Prisma
      priceDetails: priceDetails as any,
      socialLinks: socialLinks as any,
      portfolio: portfolio as any,
    };

    if (user.profile.artist) {
      // Mise à jour du profil existant
      return await this.prisma.artist.update({
        where: { id: user.profile.artist.id },
        data: artistData as any,
        include: {
          profile: {
            include: { user: true }
          },
          members: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      });
    } else {
      // Création d'un nouveau profil artiste
      return await this.prisma.artist.create({
        data: {
          profileId: user.profile.id,
          ...artistData,
        } as any,
        include: {
          profile: {
            include: { user: true }
          },
          members: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      });
    }
  }

  async generateUniqueSlug(name: string): Promise<string> {
    return generateUniqueSlug(this.prisma, name);
  }

  // ===============================
  // ARTIST MEMBER MANAGEMENT
  // ===============================

  async getArtistMembers(artistId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        members: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!artist) {
      throw new NotFoundException('Profil artiste non trouvé');
    }

    return {
      artist: {
        id: artist.id,
        artistType: artist.artistType,
        memberCount: artist.memberCount
      },
      members: artist.members
    };
  }

  async createArtistMember(artistId: string, memberData: CreateArtistMemberDto) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        members: { where: { isActive: true } }
      }
    });

    if (!artist) {
      throw new NotFoundException('Profil artiste non trouvé');
    }

    // Vérifier la limite de membres
    const maxMembers = artist.memberCount || 10;
    if (artist.members.length >= maxMembers) {
      throw new BadRequestException(`Limite de ${maxMembers} membres atteinte`);
    }

    const newMember = await this.prisma.artistMember.create({
      data: {
        ...memberData,
        artistId: artistId,
        isActive: memberData.isActive !== undefined ? memberData.isActive : true,
        joinDate: memberData.joinDate ? new Date(memberData.joinDate) : new Date()
      } as any
    });

    return {
      message: 'Membre créé avec succès',
      member: newMember
    };
  }

  async updateArtistMember(artistId: string, memberId: string, updateData: UpdateArtistMemberDto) {
    // Vérifier que le membre appartient bien à cet artiste
    const member = await this.prisma.artistMember.findFirst({
      where: {
        id: memberId,
        artistId: artistId,
        isActive: true
      }
    });

    if (!member) {
      throw new NotFoundException('Membre non trouvé pour cet artiste');
    }

    const updatedMember = await this.prisma.artistMember.update({
      where: { id: memberId },
      data: {
        ...updateData,
        joinDate: updateData.joinDate ? new Date(updateData.joinDate) : member.joinDate
      } as any
    });

    return {
      message: 'Membre mis à jour avec succès',
      member: updatedMember
    };
  }

  async getArtistMember(artistId: string, memberId: string) {
    const member = await this.prisma.artistMember.findFirst({
      where: {
        id: memberId,
        artistId: artistId,
        isActive: true
      }
    });

    if (!member) {
      throw new NotFoundException('Membre non trouvé pour cet artiste');
    }

    return {
      message: 'Membre récupéré avec succès',
      member
    };
  }

  async deleteArtistMember(artistId: string, memberId: string) {
    // Vérifier que le membre appartient bien à cet artiste
    const member = await this.prisma.artistMember.findFirst({
      where: {
        id: memberId,
        artistId: artistId,
        isActive: true
      }
    });

    if (!member) {
      throw new NotFoundException('Membre non trouvé pour cet artiste');
    }

    // Soft delete - marquer comme inactif
    await this.prisma.artistMember.update({
      where: { id: memberId },
      data: { isActive: false }
    });

    return {
      message: 'Membre supprimé avec succès'
    };
  }
}