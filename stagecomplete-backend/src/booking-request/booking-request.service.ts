import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { RespondBookingRequestDto } from './dto/respond-booking-request.dto';
import {
  BookingRequestReceivedEvent,
  BookingRequestAcceptedEvent,
  BookingRequestDeclinedEvent,
  BookingRequestCancelledEvent,
} from '../notification/events/booking-request.events';

@Injectable()
export class BookingRequestService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateBookingRequestDto) {
    // Vérifier que le user est une venue
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { venue: true },
    });

    if (!userProfile || !userProfile.venue) {
      throw new ForbiddenException('Only venues can create booking requests');
    }

    // Vérifier que l'artiste existe et est public
    const artist = await this.prisma.artist.findUnique({
      where: { id: dto.artistId },
      include: { profile: true },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    if (!artist.isPublic) {
      throw new BadRequestException('Cannot send booking request to private artist profile');
    }

    // Créer la booking request
    const bookingRequest = await this.prisma.bookingRequest.create({
      data: {
        venueId: userProfile.venue.id,
        artistId: dto.artistId,
        eventDate: new Date(dto.eventDate),
        eventType: dto.eventType,
        budget: dto.budget,
        duration: dto.duration,
        message: dto.message,
        status: 'PENDING',
      },
      include: {
        venue: {
          include: { profile: true },
        },
        artist: {
          include: { profile: true },
        },
      },
    });

    // Émettre l'événement de notification à l'artiste
    this.eventEmitter.emit(
      'booking-request.received',
      new BookingRequestReceivedEvent(
        bookingRequest.artist.profile.userId,
        userId,
        bookingRequest.id,
        bookingRequest.venue.profile.name,
        bookingRequest.eventDate,
        bookingRequest.eventType,
      ),
    );

    return bookingRequest;
  }

  async findAll(userId: string, filters?: { status?: string }) {
    // Déterminer si l'user est artiste ou venue
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { artist: true, venue: true },
    });

    if (!userProfile) {
      throw new NotFoundException('Profile not found');
    }

    const isArtist = !!userProfile.artist;
    const isVenue = !!userProfile.venue;

    if (!isArtist && !isVenue) {
      throw new ForbiddenException('Only artists and venues can view booking requests');
    }

    // Construire la query
    const where: any = {};

    if (isArtist) {
      where.artistId = userProfile.artist!.id;
    } else if (isVenue) {
      where.venueId = userProfile.venue!.id;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.bookingRequest.findMany({
      where,
      include: {
        venue: {
          include: { profile: true },
        },
        artist: {
          include: { profile: true },
        },
        event: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, requestId: string) {
    const bookingRequest = await this.prisma.bookingRequest.findUnique({
      where: { id: requestId },
      include: {
        venue: {
          include: { profile: true },
        },
        artist: {
          include: { profile: true },
        },
        event: true,
      },
    });

    if (!bookingRequest) {
      throw new NotFoundException('Booking request not found');
    }

    // Vérifier l'accès
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { artist: true, venue: true },
    });

    if (!userProfile) {
      throw new ForbiddenException('Not authorized');
    }

    const isArtist = userProfile.artist?.id === bookingRequest.artistId;
    const isVenue = userProfile.venue?.id === bookingRequest.venueId;

    if (!isArtist && !isVenue) {
      throw new ForbiddenException('Not authorized to view this booking request');
    }

    // Marquer comme vu par l'artiste si c'est la première fois
    if (isArtist && !bookingRequest.viewedByArtist) {
      await this.prisma.bookingRequest.update({
        where: { id: requestId },
        data: {
          viewedByArtist: true,
          status: 'VIEWED',
        },
      });
      bookingRequest.viewedByArtist = true;
      bookingRequest.status = 'VIEWED';
    }

    return bookingRequest;
  }

  async respond(userId: string, requestId: string, dto: RespondBookingRequestDto) {
    const bookingRequest = await this.prisma.bookingRequest.findUnique({
      where: { id: requestId },
      include: {
        venue: {
          include: { profile: true },
        },
        artist: {
          include: { profile: true },
        },
      },
    });

    if (!bookingRequest) {
      throw new NotFoundException('Booking request not found');
    }

    // Vérifier l'authorization selon l'action
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { artist: true, venue: true },
    });

    if (!userProfile) {
      throw new ForbiddenException('Not authorized');
    }

    const isArtist = userProfile.artist?.id === bookingRequest.artistId;
    const isVenue = userProfile.venue?.id === bookingRequest.venueId;

    // Artiste peut accept/decline, venue peut cancel
    if (dto.action === 'cancel') {
      if (!isVenue) {
        throw new ForbiddenException('Only the venue can cancel a booking request');
      }
    } else {
      if (!isArtist) {
        throw new ForbiddenException('Only the artist can accept or decline a booking request');
      }
    }

    // Vérifier que la request n'est pas déjà terminée
    if (['ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED'].includes(bookingRequest.status)) {
      throw new BadRequestException(`Cannot ${dto.action} a booking request with status ${bookingRequest.status}`);
    }

    // Traiter l'action
    let updatedRequest;

    if (dto.action === 'accept') {
      // Créer l'event
      const event = await this.prisma.event.create({
        data: {
          artistId: bookingRequest.artistId,
          venueId: bookingRequest.venueId,
          title: `${bookingRequest.eventType} - Confirmed Booking`,
          date: bookingRequest.eventDate,
          status: 'CONFIRMED',
          eventType: bookingRequest.eventType,
          budget: bookingRequest.budget,
          duration: bookingRequest.duration,
        },
      });

      // Mettre à jour la booking request
      updatedRequest = await this.prisma.bookingRequest.update({
        where: { id: requestId },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
          eventId: event.id,
        },
        include: {
          venue: {
            include: { profile: true },
          },
          artist: {
            include: { profile: true },
          },
          event: true,
        },
      });

      // Émettre l'événement de notification à la venue
      this.eventEmitter.emit(
        'booking-request.accepted',
        new BookingRequestAcceptedEvent(
          updatedRequest.venue.profile.userId,
          userId,
          updatedRequest.id,
          updatedRequest.artist.profile.name,
          updatedRequest.eventDate,
          event.id,
        ),
      );
    } else if (dto.action === 'decline') {
      updatedRequest = await this.prisma.bookingRequest.update({
        where: { id: requestId },
        data: {
          status: 'DECLINED',
          respondedAt: new Date(),
        },
        include: {
          venue: {
            include: { profile: true },
          },
          artist: {
            include: { profile: true },
          },
        },
      });

      // Émettre l'événement de notification à la venue
      this.eventEmitter.emit(
        'booking-request.declined',
        new BookingRequestDeclinedEvent(
          updatedRequest.venue.profile.userId,
          userId,
          updatedRequest.id,
          updatedRequest.artist.profile.name,
        ),
      );
    } else if (dto.action === 'cancel') {
      updatedRequest = await this.prisma.bookingRequest.update({
        where: { id: requestId },
        data: {
          status: 'CANCELLED',
          respondedAt: new Date(),
        },
        include: {
          venue: {
            include: { profile: true },
          },
          artist: {
            include: { profile: true },
          },
        },
      });

      // Émettre l'événement de notification à l'artiste
      this.eventEmitter.emit(
        'booking-request.cancelled',
        new BookingRequestCancelledEvent(
          updatedRequest.artist.profile.userId,
          userId,
          updatedRequest.id,
          updatedRequest.venue.profile.name,
        ),
      );
    }

    return updatedRequest;
  }

  async getStats(userId: string) {
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { artist: true, venue: true },
    });

    if (!userProfile) {
      throw new NotFoundException('Profile not found');
    }

    const isArtist = !!userProfile.artist;
    const isVenue = !!userProfile.venue;

    if (!isArtist && !isVenue) {
      return { pending: 0, accepted: 0, declined: 0 };
    }

    const where: any = isArtist
      ? { artistId: userProfile.artist!.id }
      : { venueId: userProfile.venue!.id };

    const [pending, accepted, declined] = await Promise.all([
      this.prisma.bookingRequest.count({
        where: { ...where, status: { in: ['PENDING', 'VIEWED'] } },
      }),
      this.prisma.bookingRequest.count({
        where: { ...where, status: 'ACCEPTED' },
      }),
      this.prisma.bookingRequest.count({
        where: { ...where, status: 'DECLINED' },
      }),
    ]);

    return { pending, accepted, declined };
  }
}
