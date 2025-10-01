import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';

export enum MetricEventType {
  PROFILE_VIEW = 'PROFILE_VIEW',
  SEARCH_CLICK = 'SEARCH_CLICK',
  VENUE_REQUEST = 'VENUE_REQUEST',
}

export class TrackMetricEventDto {
  @ApiProperty({
    description: 'Type d\'événement à tracker',
    enum: MetricEventType,
    example: MetricEventType.PROFILE_VIEW,
  })
  @IsEnum(MetricEventType)
  eventType: MetricEventType;

  @ApiPropertyOptional({
    description: 'URL source de l\'événement',
    example: '/search?q=jazz',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'ID de la venue (pour VENUE_REQUEST)',
    example: 'cklnwf8x40000h8l8e4q3z1p5',
  })
  @IsOptional()
  @IsString()
  venueId?: string;

  @ApiPropertyOptional({
    description: 'Métadonnées supplémentaires',
    example: { userAgent: 'Mozilla/5.0...', referrer: 'https://...' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ArtistMetricsResponseDto {
  @ApiProperty({
    description: 'Nombre total de vues du profil',
    example: 245,
  })
  profileViews: number;

  @ApiProperty({
    description: 'Nombre total de clics depuis la recherche',
    example: 87,
  })
  searchClicks: number;

  @ApiProperty({
    description: 'Nombre total de demandes de venues',
    example: 12,
  })
  venueRequests: number;

  @ApiProperty({
    description: 'Tendances par rapport au mois précédent',
    example: {
      views: { value: 25, type: 'increase' },
      clicks: { value: 15, type: 'increase' },
      requests: { value: 10, type: 'decrease' },
    },
  })
  trends: {
    views: { value: number; type: 'increase' | 'decrease' | 'stable' };
    clicks: { value: number; type: 'increase' | 'decrease' | 'stable' };
    requests: { value: number; type: 'increase' | 'decrease' | 'stable' };
  };
}

export class MetricsHistoryItemDto {
  @ApiProperty({
    description: 'Date de l\'événement',
    example: '2025-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Nombre de vues ce jour',
    example: 15,
  })
  views: number;

  @ApiProperty({
    description: 'Nombre de clics ce jour',
    example: 8,
  })
  clicks: number;

  @ApiProperty({
    description: 'Nombre de demandes ce jour',
    example: 2,
  })
  requests: number;
}

export class ArtistMetricsHistoryResponseDto {
  @ApiProperty({
    description: 'Historique des métriques par jour',
    type: [MetricsHistoryItemDto],
  })
  history: MetricsHistoryItemDto[];

  @ApiProperty({
    description: 'Période couverte en jours',
    example: 30,
  })
  days: number;
}
