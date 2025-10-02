import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdvancedSearchQueryDto,
  SearchSuggestionsDto,
  SortBy,
  AdvancedSearchResponseDto,
  SearchArtistResultDto,
  SearchSuggestionsResponseDto,
  SearchSuggestionResultDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Recherche avancée d'artistes avec full-text search
   */
  async searchArtists(
    query: AdvancedSearchQueryDto,
  ): Promise<AdvancedSearchResponseDto> {
    const startTime = Date.now();

    try {
      // Build WHERE clause
      const whereConditions = this.buildWhereConditions(query);

      // Build ORDER BY clause based on sort preference
      const orderBy = this.buildOrderBy(query);

      // Execute query with pagination
      const [artists, total] = await Promise.all([
        this.executeSearch(whereConditions, orderBy, query),
        this.prisma.artist.count({ where: whereConditions }),
      ]);

      // Format results
      const results = await Promise.all(
        artists.map((artist) => this.formatArtistResult(artist, query.q)),
      );

      // Calculate metadata
      const metadata = {
        total,
        limit: query.limit || 20,
        offset: query.offset || 0,
        hasMore: (query.offset || 0) + (query.limit || 20) < total,
        page: Math.floor((query.offset || 0) / (query.limit || 20)) + 1,
        totalPages: Math.ceil(total / (query.limit || 20)),
        executionTime: Date.now() - startTime,
        searchQuery: query.q,
        appliedFilters: this.getAppliedFilters(query),
      };

      this.logger.log(
        `Search completed in ${metadata.executionTime}ms, found ${total} results`,
      );

      return {
        results,
        metadata,
      };
    } catch (error) {
      this.logger.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Construit les conditions WHERE pour la recherche
   */
  private buildWhereConditions(
    query: AdvancedSearchQueryDto,
  ): Prisma.ArtistWhereInput {
    const conditions: Prisma.ArtistWhereInput = {
      isPublic: true, // Toujours filtrer les profils publics
    };

    // Full-text search sur la colonne search_vector
    if (query.q && query.q.trim()) {
      // Utiliser raw SQL pour recherche full-text avec PostgreSQL
      // Note: Prisma ne supporte pas nativement ts_rank, on utilisera une approche mixte
      conditions.OR = [
        // Recherche exacte dans artisticBio
        {
          artisticBio: {
            contains: query.q,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
        // Recherche dans les genres
        {
          genres: {
            hasSome: query.q.split(' ').filter((w) => w.length > 2),
          },
        },
        // Recherche dans les instruments
        {
          instruments: {
            hasSome: query.q.split(' ').filter((w) => w.length > 2),
          },
        },
        // Recherche dans le nom via profile
        {
          profile: {
            name: {
              contains: query.q,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        },
      ];
    }

    // Filtres par genres
    if (query.genres && query.genres.length > 0) {
      conditions.genres = {
        hasSome: query.genres,
      };
    }

    // Filtres par instruments
    if (query.instruments && query.instruments.length > 0) {
      conditions.instruments = {
        hasSome: query.instruments,
      };
    }

    // Filtre par expérience
    if (query.experience) {
      conditions.experience = query.experience;
    }

    // Filtre par fourchette de prix
    if (query.priceRange) {
      conditions.priceRange = query.priceRange;
    }

    // Filtre par prix min/max (plus flexible)
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      // Parse priceRange "500-1000" et compare
      // Cette logique peut être améliorée avec une colonne numérique dédiée
      conditions.priceRange = {
        not: null,
      };
    }

    // Filtre par localisation via le profil
    if (query.location) {
      if (!conditions.profile) {
        conditions.profile = {};
      }
      conditions.profile.location = {
        contains: query.location,
        mode: 'insensitive' as Prisma.QueryMode,
      };
    }

    // Filtre disponibilité
    if (query.availableOnly) {
      // Supposons qu'on a un champ availability dans le JSON
      // On peut ajouter une logique plus complexe ici
    }

    return conditions;
  }

  /**
   * Construit la clause ORDER BY en fonction du tri demandé
   */
  private buildOrderBy(
    query: AdvancedSearchQueryDto,
  ): Prisma.ArtistOrderByWithRelationInput[] {
    const sortBy = query.sortBy || SortBy.RELEVANCE;

    switch (sortBy) {
      case SortBy.POPULARITY:
        return [
          {
            metrics: {
              profileViews: 'desc',
            },
          },
          {
            metrics: {
              searchClicks: 'desc',
            },
          },
          { createdAt: 'desc' },
        ];

      case SortBy.NEWEST:
        return [{ createdAt: 'desc' }];

      case SortBy.PRICE_ASC:
        return [{ priceRange: 'asc' }];

      case SortBy.PRICE_DESC:
        return [{ priceRange: 'desc' }];

      case SortBy.RATING:
        // TODO: Implémenter système de notation
        return [{ createdAt: 'desc' }];

      case SortBy.RELEVANCE:
      default:
        // Pour la pertinence, on favorise ceux qui ont des métriques
        // et qui sont récents
        if (query.q) {
          // Si recherche textuelle, on priorise les résultats récents
          // avec de bonnes métriques
          return [
            {
              metrics: {
                profileViews: 'desc',
              },
            },
            { createdAt: 'desc' },
          ];
        }
        return [{ createdAt: 'desc' }];
    }
  }

  /**
   * Exécute la requête de recherche avec les conditions et tri
   */
  private async executeSearch(
    where: Prisma.ArtistWhereInput,
    orderBy: Prisma.ArtistOrderByWithRelationInput[],
    query: AdvancedSearchQueryDto,
  ) {
    return this.prisma.artist.findMany({
      where,
      orderBy,
      skip: query.offset || 0,
      take: query.limit || 20,
      include: {
        profile: {
          select: {
            name: true,
            avatar: true,
            location: true,
            bio: true,
          },
        },
        metrics: {
          select: {
            profileViews: true,
            searchClicks: true,
            venueRequests: true,
          },
        },
      },
    });
  }

  /**
   * Formate un résultat d'artiste pour la réponse
   */
  private async formatArtistResult(
    artist: any,
    searchQuery?: string,
  ): Promise<SearchArtistResultDto> {
    // Extract portfolio preview (first 3 photos)
    const portfolioPreview: string[] = [];
    if (artist.portfolio && typeof artist.portfolio === 'object') {
      const portfolio = artist.portfolio as any;
      if (Array.isArray(portfolio.photos)) {
        portfolioPreview.push(...portfolio.photos.slice(0, 3));
      }
    }

    // Calculate relevance score if search query provided
    let relevanceScore: number | undefined;
    if (searchQuery) {
      relevanceScore = this.calculateRelevanceScore(artist, searchQuery);
    }

    // Calculate popularity score
    const popularityScore = this.calculatePopularityScore(artist);

    return {
      id: artist.id,
      name: artist.profile?.name || 'Artiste',
      avatar: artist.profile?.avatar,
      location: artist.profile?.location,
      genres: artist.genres || [],
      instruments: artist.instruments || [],
      priceRange: artist.priceRange ?? undefined,
      experience: artist.experience ?? undefined,
      artisticBio: artist.artisticBio,
      yearsActive: artist.yearsActive,
      publicSlug: artist.publicSlug,
      portfolioPreview,
      relevanceScore,
      popularityScore,
      profileViews: artist.metrics?.profileViews || 0,
      memberCount: artist.memberCount,
      artistType: artist.artistType,
    };
  }

  /**
   * Calcule un score de pertinence basé sur la requête
   */
  private calculateRelevanceScore(artist: any, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(' ').filter((t) => t.length > 2);

    // Correspondance exacte dans le nom (poids 10)
    if (artist.profile?.name?.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Correspondance dans les genres (poids 5 par terme)
    queryTerms.forEach((term) => {
      if (
        artist.genres?.some((g: string) => g.toLowerCase().includes(term))
      ) {
        score += 5;
      }
    });

    // Correspondance dans les instruments (poids 3 par terme)
    queryTerms.forEach((term) => {
      if (
        artist.instruments?.some((i: string) => i.toLowerCase().includes(term))
      ) {
        score += 3;
      }
    });

    // Correspondance dans la bio (poids 2)
    if (artist.artisticBio?.toLowerCase().includes(queryLower)) {
      score += 2;
    }

    // Normaliser entre 0 et 1
    return Math.min(score / 20, 1);
  }

  /**
   * Calcule un score de popularité basé sur les métriques
   */
  private calculatePopularityScore(artist: any): number {
    const views = artist.metrics?.profileViews || 0;
    const clicks = artist.metrics?.searchClicks || 0;
    const requests = artist.metrics?.venueRequests || 0;

    // Formule pondérée: vues x0.3 + clics x0.5 + demandes x1.0
    const rawScore = views * 0.3 + clicks * 0.5 + requests * 1.0;

    // Normaliser avec log scale pour éviter domination des gros chiffres
    return Math.log10(rawScore + 1) / 3; // Score entre 0 et ~1
  }

  /**
   * Retourne les filtres appliqués pour les métadonnées
   */
  private getAppliedFilters(query: AdvancedSearchQueryDto): Record<string, any> {
    const filters: Record<string, any> = {};

    if (query.genres?.length) filters.genres = query.genres;
    if (query.instruments?.length) filters.instruments = query.instruments;
    if (query.location) filters.location = query.location;
    if (query.experience) filters.experience = query.experience;
    if (query.priceRange) filters.priceRange = query.priceRange;
    if (query.minPrice) filters.minPrice = query.minPrice;
    if (query.maxPrice) filters.maxPrice = query.maxPrice;
    if (query.availableOnly) filters.availableOnly = query.availableOnly;

    return filters;
  }

  /**
   * Suggestions d'auto-complétion
   */
  async getSuggestions(
    dto: SearchSuggestionsDto,
  ): Promise<SearchSuggestionsResponseDto> {
    const startTime = Date.now();
    const suggestions: SearchSuggestionResultDto[] = [];
    const query = dto.q.trim().toLowerCase();

    if (query.length < 2) {
      return { suggestions: [], query: dto.q, executionTime: 0 };
    }

    try {
      // 1. Suggestions d'artistes
      const artists = await this.prisma.artist.findMany({
        where: {
          isPublic: true,
          profile: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        take: 4,
        include: {
          profile: {
            select: {
              name: true,
              avatar: true,
              location: true,
            },
          },
        },
      });

      artists.forEach((artist) => {
        suggestions.push({
          id: artist.id,
          type: 'artist',
          text: artist.profile?.name || '',
          subtitle: artist.profile?.location ?? undefined,
          avatar: artist.profile?.avatar ?? undefined,
        });
      });

      // 2. Suggestions de genres
      const allGenres = await this.prisma.artist.findMany({
        where: { isPublic: true },
        select: { genres: true },
        distinct: ['id'],
      });

      const uniqueGenres = Array.from(
        new Set(allGenres.flatMap((a) => a.genres)),
      )
        .filter((g) => g.toLowerCase().includes(query))
        .slice(0, 3);

      uniqueGenres.forEach((genre) => {
        suggestions.push({
          id: genre,
          type: 'genre',
          text: genre,
          subtitle: 'Genre musical',
        });
      });

      // 3. Suggestions d'instruments
      const allInstruments = await this.prisma.artist.findMany({
        where: { isPublic: true },
        select: { instruments: true },
        distinct: ['id'],
      });

      const uniqueInstruments = Array.from(
        new Set(allInstruments.flatMap((a) => a.instruments)),
      )
        .filter((i) => i.toLowerCase().includes(query))
        .slice(0, 2);

      uniqueInstruments.forEach((instrument) => {
        suggestions.push({
          id: instrument,
          type: 'instrument',
          text: instrument,
          subtitle: 'Instrument',
        });
      });

      // Limiter au nombre demandé
      const limitedSuggestions = suggestions.slice(0, dto.limit || 8);

      return {
        suggestions: limitedSuggestions,
        query: dto.q,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error('Suggestions error:', error);
      return { suggestions: [], query: dto.q, executionTime: 0 };
    }
  }

  /**
   * Récupère les genres populaires
   */
  async getPopularGenres(limit: number = 10): Promise<Array<{ genre: string; count: number }>> {
    const artists = await this.prisma.artist.findMany({
      where: { isPublic: true },
      select: { genres: true },
    });

    const genreCount = new Map<string, number>();
    artists.forEach((artist) => {
      artist.genres.forEach((genre) => {
        genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
      });
    });

    return Array.from(genreCount.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Récupère les artistes tendance (popularité récente)
   */
  async getTrendingArtists(limit: number = 6) {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    return this.prisma.artist.findMany({
      where: {
        isPublic: true,
        createdAt: {
          gte: last30Days,
        },
      },
      orderBy: [
        {
          metrics: {
            profileViews: 'desc',
          },
        },
        {
          metrics: {
            searchClicks: 'desc',
          },
        },
      ],
      take: limit,
      include: {
        profile: {
          select: {
            name: true,
            avatar: true,
          },
        },
        metrics: {
          select: {
            profileViews: true,
            searchClicks: true,
          },
        },
      },
    });
  }
}
