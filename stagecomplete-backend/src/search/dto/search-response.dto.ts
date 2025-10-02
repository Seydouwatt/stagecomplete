import { ApiProperty } from '@nestjs/swagger';

export class SearchArtistResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ type: [String] })
  genres: string[];

  @ApiProperty({ type: [String] })
  instruments: string[];

  @ApiProperty({ required: false })
  priceRange?: string;

  @ApiProperty({ required: false })
  experience?: string;

  @ApiProperty({ required: false })
  artisticBio?: string;

  @ApiProperty({ required: false })
  yearsActive?: number;

  @ApiProperty({ required: false })
  publicSlug?: string;

  @ApiProperty({ required: false, description: 'Portfolio photos preview (first 3)' })
  portfolioPreview?: string[];

  @ApiProperty({ required: false, description: 'Relevance score (0-1)' })
  relevanceScore?: number;

  @ApiProperty({ required: false, description: 'Popularity score based on views/clicks' })
  popularityScore?: number;

  @ApiProperty({ required: false })
  profileViews?: number;

  @ApiProperty({ required: false })
  memberCount?: number;

  @ApiProperty({ required: false })
  artistType?: string;
}

export class SearchMetadataDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  hasMore: boolean;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty({ required: false })
  executionTime?: number;

  @ApiProperty({ required: false })
  searchQuery?: string;

  @ApiProperty({ required: false })
  appliedFilters?: Record<string, any>;
}

export class AdvancedSearchResponseDto {
  @ApiProperty({ type: [SearchArtistResultDto] })
  results: SearchArtistResultDto[];

  @ApiProperty({ type: SearchMetadataDto })
  metadata: SearchMetadataDto;

  @ApiProperty({ required: false, type: [String] })
  suggestions?: string[];
}

export class SearchSuggestionResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: 'artist' | 'genre' | 'instrument' | 'location';

  @ApiProperty()
  text: string;

  @ApiProperty({ required: false })
  subtitle?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  matchScore?: number;
}

export class SearchSuggestionsResponseDto {
  @ApiProperty({ type: [SearchSuggestionResultDto] })
  suggestions: SearchSuggestionResultDto[];

  @ApiProperty()
  query: string;

  @ApiProperty({ required: false })
  executionTime?: number;
}

export class PopularSearchDto {
  @ApiProperty()
  term: string;

  @ApiProperty()
  count: number;

  @ApiProperty({ required: false })
  category?: string;
}

export class TrendingArtistDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ type: [String] })
  genres: string[];

  @ApiProperty()
  trendScore: number;

  @ApiProperty({ required: false })
  publicSlug?: string;
}
