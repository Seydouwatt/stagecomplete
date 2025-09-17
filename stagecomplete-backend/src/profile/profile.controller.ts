import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from '../auth/decorators';

@ApiTags('profile')
@Controller('profile')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer le profil utilisateur',
    description: "Retourne le profil complet de l'utilisateur connecté",
  })
  @ApiOkResponse({
    description: 'Profil récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        profile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            bio: { type: 'string' },
            avatar: { type: 'string' },
            phone: { type: 'string' },
            location: { type: 'string' },
            website: { type: 'string' },
            socialLinks: { type: 'object' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT manquant ou invalide' })
  @ApiNotFoundResponse({ description: 'Utilisateur ou profil non trouvé' })
  async getProfile(@GetUser() user: AuthenticatedUser) {
    return this.profileService.getProfile(user.userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mettre à jour le profil utilisateur',
    description:
      "Met à jour les informations du profil de l'utilisateur connecté",
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Données du profil à mettre à jour',
    examples: {
      complete: {
        summary: 'Profil complet',
        value: {
          name: 'Jean Dupont',
          bio: "Musicien professionnel spécialisé dans le jazz moderne avec 10 ans d'expérience.",
          avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
          phone: '+33123456789',
          location: 'Paris, France',
          website: 'https://jeandupont-music.com',
          socialLinks: {
            instagram: 'https://instagram.com/jeandupont_music',
            facebook: 'https://facebook.com/jeandupont.music',
            youtube: 'https://youtube.com/c/jeandupont',
            linkedin: 'https://linkedin.com/in/jean-dupont-music',
          },
        },
      },
      partial: {
        summary: 'Mise à jour partielle',
        value: {
          bio: 'Nouvelle biographie mise à jour',
          location: 'Lyon, France',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Profil mis à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        profile: { type: 'object' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Données invalides ou profil non trouvé',
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT manquant ou invalide' })
  async updateProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      return await this.profileService.updateProfile(
        user.userId,
        updateProfileDto,
      );
    } catch (error) {
      throw new BadRequestException({
        message: 'Erreur lors de la mise à jour du profil',
        error: error.message || 'Erreur inconnue',
      });
    }
  }

  @Get('completion')
  @ApiOperation({
    summary: 'Obtenir le pourcentage de complétion du profil',
    description:
      'Retourne le pourcentage de complétion du profil et les champs manquants',
  })
  @ApiOkResponse({
    description: 'Statut de complétion récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        completion: {
          type: 'number',
          description: 'Pourcentage de complétion (0-100)',
          example: 75,
        },
        missingFields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Liste des champs manquants',
          example: ['bio', 'website'],
        },
        totalFields: {
          type: 'number',
          description: 'Nombre total de champs',
          example: 7,
        },
        filledFields: {
          type: 'number',
          description: 'Nombre de champs remplis',
          example: 5,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT manquant ou invalide' })
  async getProfileCompletion(@GetUser() user: AuthenticatedUser) {
    return this.profileService.getProfileCompletion(user.userId);
  }
}
