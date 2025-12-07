import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import {
  AdvancedSearchQueryDto,
  SearchSuggestionsDto,
  AdvancedSearchResponseDto,
  SearchSuggestionsResponseDto,
  PopularSearchDto,
  TrendingArtistDto,
} from './dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('artists')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recherche avancée d\'artistes',
    description:
      'Recherche d\'artistes avec full-text search, filtres multiples et tri personnalisé',
  })
  @ApiOkResponse({
    description: 'Résultats de recherche avec métadonnées',
    type: AdvancedSearchResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de requête invalides',
  })
  @ApiQuery({ name: 'q', required: false, description: 'Recherche textuelle' })
  @ApiQuery({ name: 'genres', required: false, description: 'Genres (comma-separated)' })
  @ApiQuery({ name: 'instruments', required: false, description: 'Instruments (comma-separated)' })
  @ApiQuery({ name: 'location', required: false, description: 'Localisation' })
  @ApiQuery({ name: 'experience', required: false, enum: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL'] })
  @ApiQuery({ name: 'priceRange', required: false, description: 'Fourchette de prix (ex: 500-1000)' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['relevance', 'popularity', 'price_asc', 'price_desc', 'newest', 'rating'] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre de résultats (défaut: 20, max: 100)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Décalage pagination (défaut: 0)' })
  @ApiQuery({ name: 'availableOnly', required: false, type: Boolean, description: 'Artistes disponibles uniquement' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Rayon de recherche en km' })
  async searchArtists(
    @Query() query: AdvancedSearchQueryDto,
  ): Promise<AdvancedSearchResponseDto> {
    return this.searchService.searchArtists(query);
  }

  @Get('suggestions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Suggestions d\'auto-complétion',
    description:
      'Retourne des suggestions d\'artistes, genres et instruments pour l\'auto-complétion',
  })
  @ApiOkResponse({
    description: 'Suggestions pour la requête',
    type: SearchSuggestionsResponseDto,
  })
  @ApiQuery({ name: 'q', required: true, description: 'Requête de recherche (min 2 caractères)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre de suggestions (défaut: 8, max: 20)' })
  async getSuggestions(
    @Query() dto: SearchSuggestionsDto,
  ): Promise<SearchSuggestionsResponseDto> {
    return this.searchService.getSuggestions(dto);
  }

  @Get('popular-genres')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Genres musicaux populaires',
    description: 'Retourne les genres les plus populaires sur la plateforme',
  })
  @ApiOkResponse({
    description: 'Liste des genres populaires avec compteurs',
    type: [PopularSearchDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre de genres (défaut: 10)' })
  async getPopularGenres(
    @Query('limit') limit?: number,
  ): Promise<Array<{ genre: string; count: number }>> {
    return this.searchService.getPopularGenres(limit ? parseInt(limit.toString(), 10) : 10);
  }

  @Get('trending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Artistes tendance',
    description:
      'Retourne les artistes les plus populaires des 30 derniers jours',
  })
  @ApiOkResponse({
    description: 'Artistes tendance avec scores',
    type: [TrendingArtistDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'artistes (défaut: 6)' })
  async getTrendingArtists(@Query('limit') limit?: number) {
    const artists = await this.searchService.getTrendingArtists(
      limit ? parseInt(limit.toString(), 10) : 6,
    );

    return artists.map((artist) => ({
      id: artist.id,
      name: artist.profile?.name || '',
      avatar: artist.profile?.avatar,
      genres: artist.genres,
      publicSlug: artist.publicSlug,
      trendScore:
        (artist.metrics?.profileViews || 0) * 0.3 +
        (artist.metrics?.searchClicks || 0) * 0.7,
    }));
  }

  @Get('quick-filters')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filtres rapides disponibles',
    description:
      'Retourne tous les genres, instruments et localisations disponibles pour les filtres',
  })
  @ApiOkResponse({
    description: 'Options de filtres disponibles',
    schema: {
      type: 'object',
      properties: {
        genres: { type: 'array', items: { type: 'string' } },
        instruments: { type: 'array', items: { type: 'string' } },
        locations: { type: 'array', items: { type: 'string' } },
        experienceLevels: {
          type: 'array',
          items: { type: 'string' },
          example: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL'],
        },
        priceRanges: {
          type: 'array',
          items: { type: 'string' },
          example: ['0-200', '200-500', '500-1000', '1000-2000', '2000+'],
        },
      },
    },
  })
  async getQuickFilters() {
    // Récupérer tous les genres et instruments uniques
    const artists = await this.searchService['prisma'].artist.findMany({
      where: { isPublic: true },
      select: {
        genres: true,
        instruments: true,
        profile: {
          select: {
            location: true,
          },
        },
      },
    });

    const genres = Array.from(
      new Set(artists.flatMap((a) => a.genres)),
    ).sort();

    const instruments = Array.from(
      new Set(artists.flatMap((a) => a.instruments)),
    ).sort();

    const locations = Array.from(
      new Set(artists.map((a) => a.profile?.location).filter(Boolean)),
    ).sort() as string[];

    return {
      genres,
      instruments,
      locations,
      experienceLevels: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL'],
      priceRanges: ['0-200', '200-500', '500-1000', '1000-2000', '2000+'],
    };
  }
}
