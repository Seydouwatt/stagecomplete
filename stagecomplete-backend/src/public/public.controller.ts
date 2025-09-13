import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private authService: AuthService) {}

  @Get('artist/:identifier')
  @ApiOperation({
    summary: 'Récupérer un profil artiste public',
    description: 'Accède à la fiche publique d\'un artiste via son slug ou ID'
  })
  @ApiParam({
    name: 'identifier',
    description: 'Slug personnalisé ou ID de l\'artiste',
    example: 'jean-dupont-music'
  })
  @ApiOkResponse({
    description: 'Profil artiste public récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        artist: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            genres: { type: 'array', items: { type: 'string' } },
            instruments: { type: 'array', items: { type: 'string' } },
            artisticBio: { type: 'string' },
            experience: { type: 'string' },
            yearsActive: { type: 'number' },
            priceRange: { type: 'string' },
            socialLinks: { type: 'object' },
            portfolio: { type: 'object' },
            publicSlug: { type: 'string' },
            profile: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                bio: { type: 'string' },
                avatar: { type: 'string' },
                location: { type: 'string' },
                website: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Profil artiste non trouvé ou non public',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Profil artiste public non trouvé ou non visible' }
      }
    }
  })
  async getPublicArtistProfile(@Param('identifier') identifier: string) {
    try {
      const artist = await this.authService.getPublicArtistProfile(identifier);
      return {
        message: 'Profil artiste public récupéré avec succès',
        artist,
      };
    } catch (error) {
      throw new NotFoundException('Profil artiste public non trouvé ou non visible');
    }
  }

  @Get('search/artists')
  @ApiOperation({
    summary: 'Rechercher des artistes publics',
    description: 'Recherche d\'artistes avec filtres pour les venues'
  })
  @ApiQuery({
    name: 'genres',
    required: false,
    description: 'Genres musicaux (séparés par des virgules)',
    example: 'Rock,Blues,Jazz'
  })
  @ApiQuery({
    name: 'experience',
    required: false,
    description: 'Niveau d\'expérience',
    enum: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL']
  })
  @ApiQuery({
    name: 'priceRange',
    required: false,
    description: 'Fourchette de prix',
    enum: ['0-200', '200-500', '500-1000', '1000-2000', '2000+']
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Localisation (ville ou région)',
    example: 'Paris'
  })
  @ApiQuery({
    name: 'instruments',
    required: false,
    description: 'Instruments (séparés par des virgules)',
    example: 'Guitare,Piano,Chant'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre de résultats par page',
    example: 20
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Décalage pour la pagination',
    example: 0
  })
  @ApiOkResponse({
    description: 'Résultats de recherche',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        results: {
          type: 'object',
          properties: {
            artists: {
              type: 'array',
              items: { type: 'object' }
            },
            total: { type: 'number' },
            hasMore: { type: 'boolean' },
            pagination: {
              type: 'object',
              properties: {
                limit: { type: 'number' },
                offset: { type: 'number' },
                total: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async searchArtists(
    @Query('genres') genres?: string,
    @Query('experience') experience?: string,
    @Query('priceRange') priceRange?: string,
    @Query('location') location?: string,
    @Query('instruments') instruments?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // Convertir les paramètres de query
    const filters = {
      genres: genres ? genres.split(',').map(g => g.trim()) : undefined,
      experience,
      priceRange,
      location,
      instruments: instruments ? instruments.split(',').map(i => i.trim()) : undefined,
      isPublic: true, // Toujours true pour la recherche publique
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    };

    const results = await this.authService.searchArtists(filters);

    return {
      message: 'Recherche effectuée avec succès',
      results: {
        ...results,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: results.total,
        },
      },
    };
  }

  @Get('artists/featured')
  @ApiOperation({
    summary: 'Récupérer les artistes mis en avant',
    description: 'Retourne une sélection d\'artistes publics mis en avant'
  })
  @ApiOkResponse({
    description: 'Artistes mis en avant récupérés avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        artists: {
          type: 'array',
          items: { type: 'object' }
        }
      }
    }
  })
  async getFeaturedArtists() {
    // Pour l'instant, on retourne les 6 artistes les plus récents
    const results = await this.authService.searchArtists({
      isPublic: true,
      limit: 6,
      offset: 0,
    });

    return {
      message: 'Artistes mis en avant récupérés avec succès',
      artists: results.artists,
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Statistiques publiques de la plateforme',
    description: 'Retourne les statistiques générales publiques'
  })
  @ApiOkResponse({
    description: 'Statistiques récupérées avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        stats: {
          type: 'object',
          properties: {
            totalArtists: { type: 'number' },
            totalVenues: { type: 'number' },
            publicProfiles: { type: 'number' }
          }
        }
      }
    }
  })
  async getPublicStats() {
    // Note: Ces statistiques pourraient être mises en cache pour de meilleures performances
    const stats = {
      totalArtists: 0,
      totalVenues: 0,
      publicProfiles: 0,
    };

    // Ces requêtes pourraient être optimisées ou mise en cache
    try {
      const artistCount = await this.authService['prisma'].artist.count();
      const venueCount = await this.authService['prisma'].venue.count();
      const publicArtistCount = await this.authService['prisma'].artist.count({
        where: { isPublic: true }
      });

      stats.totalArtists = artistCount;
      stats.totalVenues = venueCount;
      stats.publicProfiles = publicArtistCount;
    } catch (error) {
      // En cas d'erreur, retourner des stats par défaut
      console.warn('Erreur lors du calcul des statistiques:', error);
    }

    return {
      message: 'Statistiques récupérées avec succès',
      stats,
    };
  }
}