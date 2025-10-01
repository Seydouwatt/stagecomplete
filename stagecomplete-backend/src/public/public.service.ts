import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricEventType } from '../common/dto';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  /**
   * Track a profile view event
   */
  async trackArtistView(identifier: string): Promise<void> {
    try {
      // Find artist by slug or ID
      const artist = await this.findArtistByIdentifier(identifier);

      if (!artist) {
        return; // Silently fail for non-existent artists
      }

      // Create metrics record if it doesn't exist
      await this.ensureMetricsExist(artist.id);

      // Track the event (fire and forget)
      await Promise.all([
        this.createMetricsEvent(artist.id, MetricEventType.PROFILE_VIEW),
        this.incrementMetricCounter(artist.id, 'profileViews'),
      ]);
    } catch (error) {
      // Log but don't throw - tracking shouldn't break user experience
      console.error('[PublicService] Error tracking profile view:', error);
    }
  }

  /**
   * Track a search click event
   */
  async trackArtistClick(artistId: string, source?: string): Promise<void> {
    try {
      // Ensure metrics exist
      await this.ensureMetricsExist(artistId);

      // Track the event
      await Promise.all([
        this.createMetricsEvent(
          artistId,
          MetricEventType.SEARCH_CLICK,
          source,
        ),
        this.incrementMetricCounter(artistId, 'searchClicks'),
      ]);
    } catch (error) {
      console.error('[PublicService] Error tracking search click:', error);
    }
  }

  /**
   * Track a venue request event
   */
  async trackVenueRequest(
    artistId: string,
    venueId: string,
  ): Promise<void> {
    try {
      // Ensure metrics exist
      await this.ensureMetricsExist(artistId);

      // Track the event
      await Promise.all([
        this.createMetricsEvent(
          artistId,
          MetricEventType.VENUE_REQUEST,
          null,
          venueId,
        ),
        this.incrementMetricCounter(artistId, 'venueRequests'),
      ]);
    } catch (error) {
      console.error('[PublicService] Error tracking venue request:', error);
    }
  }

  /**
   * Find artist by slug or ID
   */
  private async findArtistByIdentifier(identifier: string) {
    return this.prisma.artist.findFirst({
      where: {
        OR: [
          { id: identifier },
          { publicSlug: identifier },
        ],
        isPublic: true,
      },
    });
  }

  /**
   * Ensure metrics record exists for artist
   */
  private async ensureMetricsExist(artistId: string): Promise<void> {
    await this.prisma.artistMetrics.upsert({
      where: { artistId },
      create: { artistId },
      update: {}, // No update needed, just ensure it exists
    });
  }

  /**
   * Create a metrics event record
   */
  private async createMetricsEvent(
    artistId: string,
    eventType: MetricEventType,
    source?: string,
    venueId?: string,
  ): Promise<void> {
    await this.prisma.artistMetricsEvent.create({
      data: {
        artistId,
        eventType,
        source,
        venueId,
      },
    });
  }

  /**
   * Increment a specific metric counter
   */
  private async incrementMetricCounter(
    artistId: string,
    counterField: 'profileViews' | 'searchClicks' | 'venueRequests',
  ): Promise<void> {
    const monthField = this.getMonthField(counterField);

    await this.prisma.artistMetrics.update({
      where: { artistId },
      data: {
        [counterField]: { increment: 1 },
        [monthField]: { increment: 1 },
      },
    });
  }

  /**
   * Get the corresponding month field for a counter
   */
  private getMonthField(
    counterField: 'profileViews' | 'searchClicks' | 'venueRequests',
  ): string {
    const fieldMap = {
      profileViews: 'viewsThisMonth',
      searchClicks: 'clicksThisMonth',
      venueRequests: 'requestsThisMonth',
    };

    return fieldMap[counterField];
  }
}
