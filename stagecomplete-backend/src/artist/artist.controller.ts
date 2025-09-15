import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
  UpdateArtistProfileDto,
  CreateArtistMemberDto,
  UpdateArtistMemberDto,
  ArtistType,
} from '../common/dto';
import { ArtistService } from './artist.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from '../auth/decorators';

@ApiTags('artist')
@Controller('artist')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  // ========== ENDPOINTS PROFIL ARTISTE ÉTENDU ==========

  @Get('profile')
  @ApiOperation({
    summary: 'Récupérer le profil artiste étendu',
    description: 'Retourne le profil artiste complet avec toutes les informations détaillées'
  })
  @ApiOkResponse({
    description: 'Profil artiste récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        artist: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            profile: { type: 'object' },
            genres: { type: 'array', items: { type: 'string' } },
            instruments: { type: 'array', items: { type: 'string' } },
            artisticBio: { type: 'string' },
            experience: { type: 'string' },
            yearsActive: { type: 'number' },
            priceRange: { type: 'string' },
            socialLinks: { type: 'object' },
            portfolio: { type: 'object' },
            isPublic: { type: 'boolean' },
            publicSlug: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Non autorisé - réservé aux artistes' })
  async getArtistProfile(@GetUser() user: AuthenticatedUser) {
    const artistProfile = await this.artistService.getArtistProfile(user.userId);
    return {
      message: 'Profil artiste récupéré avec succès',
      artist: artistProfile,
    };
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mettre à jour le profil artiste étendu',
    description: 'Met à jour toutes les informations du profil artiste'
  })
  @ApiBody({
    type: UpdateArtistProfileDto,
    description: 'Données du profil artiste à mettre à jour',
    examples: {
      complete: {
        summary: 'Profil artiste complet',
        value: {
          genres: ['Rock', 'Blues', 'Jazz'],
          instruments: ['Guitare', 'Piano', 'Chant'],
          experience: 'PROFESSIONAL',
          yearsActive: 10,
          artisticBio: 'Musicien professionnel avec 10 ans d\'expérience sur scène...',
          specialties: ['CONCERT', 'WEDDING'],
          equipment: ['Guitare électrique', 'Amplificateur', 'Pédales'],
          requirements: ['Scène', 'Système son', 'Éclairage'],
          priceRange: '500-1000',
          priceDetails: {
            concert: 800,
            wedding: 1200,
            private: 600,
            conditions: 'Transport inclus dans un rayon de 50km'
          },
          travelRadius: 50,
          socialLinks: {
            spotify: 'https://open.spotify.com/artist/123',
            youtube: 'https://youtube.com/@artiste',
            instagram: 'https://instagram.com/artiste_music'
          },
          isPublic: true,
          publicSlug: 'jean-dupont-music'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Profil artiste mis à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        artist: { type: 'object' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Données invalides ou utilisateur non artiste' })
  @ApiUnauthorizedResponse({ description: 'Token JWT manquant ou invalide' })
  async updateArtistProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() updateArtistProfileDto: UpdateArtistProfileDto,
  ) {
    try {
      const updatedProfile = await this.artistService.updateArtistProfile(
        user.userId,
        updateArtistProfileDto,
      );

      return {
        message: 'Profil artiste mis à jour avec succès',
        artist: updatedProfile,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Erreur lors de la mise à jour du profil artiste',
        error: error.message || 'Erreur inconnue',
      });
    }
  }

  @Post('generate-slug')
  @ApiOperation({
    summary: 'Générer un slug unique pour l\'URL publique',
    description: 'Génère un slug URL friendly basé sur le nom d\'artiste'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Jean Dupont Music' }
      },
      required: ['name']
    }
  })
  @ApiOkResponse({
    description: 'Slug généré avec succès',
    schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', example: 'jean-dupont-music' }
      }
    }
  })
  async generateSlug(@Body('name') name: string) {
    const slug = await this.artistService.generateUniqueSlug(name);
    return { slug };
  }

  // ===============================
  // ARTIST MEMBER MANAGEMENT ENDPOINTS
  // ===============================

  @Get('members')
  @ApiOperation({
    summary: 'Récupérer les membres de l\'artiste',
    description: 'Récupère tous les membres actifs de l\'artiste connecté'
  })
  @ApiOkResponse({
    description: 'Membres récupérés avec succès',
    schema: {
      type: 'object',
      properties: {
        artist: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            artistType: { type: 'string', enum: ['SOLO', 'BAND', 'THEATER_GROUP', 'COMEDY_GROUP', 'ORCHESTRA', 'CHOIR', 'OTHER'] },
            memberCount: { type: 'number' }
          }
        },
        members: {
          type: 'array',
          items: { type: 'object' }
        }
      }
    }
  })
  async getArtistMembers(@GetUser() user: AuthenticatedUser) {
    // Récupérer l'artiste lié à l'utilisateur
    let artist = await this.artistService.getArtistProfile(user.userId);
    if (!artist) {
      // Si le profil artiste n'existe pas, en créer un par défaut pour un groupe
      const defaultArtistProfile: UpdateArtistProfileDto = {
        artistType: ArtistType.BAND,
        memberCount: 5
      };
      artist = await this.artistService.updateArtistProfile(user.userId, defaultArtistProfile) as any;
    }

    if (!artist) {
      throw new BadRequestException('Profil artiste introuvable');
    }
    return this.artistService.getArtistMembers(artist.id);
  }

  @Post('members')
  @ApiOperation({
    summary: 'Ajouter un nouveau membre',
    description: 'Ajoute un nouveau membre au groupe de l\'artiste connecté'
  })
  @ApiBody({ type: CreateArtistMemberDto })
  @ApiOkResponse({ description: 'Membre créé avec succès' })
  @ApiBadRequestResponse({ description: 'Données invalides ou limite de membres atteinte' })
  async createArtistMember(@GetUser() user: AuthenticatedUser, @Body() memberData: CreateArtistMemberDto) {
    // Récupérer l'artiste lié à l'utilisateur
    let artist = await this.artistService.getArtistProfile(user.userId);
    if (!artist) {
      // Si le profil artiste n'existe pas, en créer un par défaut
      const defaultArtistProfile: UpdateArtistProfileDto = {
        artistType: ArtistType.BAND,
        memberCount: 5
      };
      artist = await this.artistService.updateArtistProfile(user.userId, defaultArtistProfile) as any;
    }

    if (!artist) {
      throw new BadRequestException('Profil artiste introuvable');
    }
    return this.artistService.createArtistMember(artist.id, memberData);
  }

  @Put('members/:memberId')
  @ApiOperation({
    summary: 'Mettre à jour un membre',
    description: 'Met à jour les informations d\'un membre du groupe'
  })
  @ApiBody({ type: UpdateArtistMemberDto })
  @ApiOkResponse({ description: 'Membre mis à jour avec succès' })
  @ApiBadRequestResponse({ description: 'Membre non trouvé ou données invalides' })
  async updateArtistMember(
    @GetUser() user: AuthenticatedUser,
    @Param('memberId') memberId: string,
    @Body() updateData: UpdateArtistMemberDto
  ) {
    // Récupérer l'artiste lié à l'utilisateur
    const artist = await this.artistService.getArtistProfile(user.userId);
    if (!artist) {
      throw new BadRequestException('Profil artiste non trouvé');
    }

    return this.artistService.updateArtistMember(artist.id, memberId, updateData);
  }

  @Get('members/:memberId')
  @ApiOperation({
    summary: 'Récupérer un membre spécifique',
    description: 'Récupère les informations détaillées d\'un membre du groupe'
  })
  @ApiOkResponse({ description: 'Membre récupéré avec succès' })
  @ApiBadRequestResponse({ description: 'Membre non trouvé' })
  async getArtistMember(@GetUser() user: AuthenticatedUser, @Param('memberId') memberId: string) {
    // Récupérer l'artiste lié à l'utilisateur
    const artist = await this.artistService.getArtistProfile(user.userId);
    if (!artist) {
      throw new BadRequestException('Profil artiste non trouvé');
    }

    return this.artistService.getArtistMember(artist.id, memberId);
  }

  @Delete('members/:memberId')
  @ApiOperation({
    summary: 'Supprimer un membre',
    description: 'Désactive un membre du groupe (soft delete)'
  })
  @ApiOkResponse({
    description: 'Membre supprimé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Membre supprimé avec succès' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Membre non trouvé' })
  async deleteArtistMember(@GetUser() user: AuthenticatedUser, @Param('memberId') memberId: string) {
    // Récupérer l'artiste lié à l'utilisateur
    const artist = await this.artistService.getArtistProfile(user.userId);
    if (!artist) {
      throw new BadRequestException('Profil artiste non trouvé');
    }

    return this.artistService.deleteArtistMember(artist.id, memberId);
  }
}