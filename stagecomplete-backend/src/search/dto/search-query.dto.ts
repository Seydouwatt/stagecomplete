import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum SortBy {
  RELEVANCE = 'relevance',
  POPULARITY = 'popularity',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
  RATING = 'rating',
}

export class AdvancedSearchQueryDto {
  @ApiPropertyOptional({
    description: 'Texte de recherche (full-text search)',
    example: 'jazz paris guitare',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Genres musicaux (séparés par virgule)',
    example: 'Jazz,Blues,Rock',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.split(',').map((g: string) => g.trim()))
  genres?: string[];

  @ApiPropertyOptional({
    description: 'Instruments (séparés par virgule)',
    example: 'Guitare,Piano,Batterie',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.split(',').map((i: string) => i.trim()))
  instruments?: string[];

  @ApiPropertyOptional({
    description: 'Localisation (ville ou région)',
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "Niveau d'expérience",
    enum: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL'],
  })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({
    description: 'Fourchette de prix',
    example: '500-1000',
  })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({
    description: 'Prix minimum',
    example: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Prix maximum',
    example: 2000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(10000)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Tri des résultats',
    enum: SortBy,
    default: SortBy.RELEVANCE,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.RELEVANCE;

  @ApiPropertyOptional({
    description: 'Nombre de résultats par page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Décalage pour la pagination',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Artistes disponibles uniquement',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  availableOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Rayon de recherche en km (à partir de location)',
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  radius?: number;
}

export class SearchSuggestionsDto {
  @ApiProperty({
    description: 'Requête de recherche pour auto-complete',
    example: 'jaz',
    minLength: 2,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  q: string;

  @ApiPropertyOptional({
    description: 'Nombre de suggestions',
    default: 8,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 8;
}
