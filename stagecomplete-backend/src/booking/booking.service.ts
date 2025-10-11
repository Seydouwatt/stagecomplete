import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    // Trouver l'artiste associé à l'utilisateur
    const artist = await this.prisma.artist.findFirst({
      where: { profile: { userId } },
    });

    if (!artist) {
      throw new ForbiddenException('Artist profile not found');
    }

    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        location: dto.location,
        address: dto.address,
        duration: dto.duration,
        budget: dto.budget,
        status: (dto.status as BookingStatus) || BookingStatus.CONFIRMED,
        eventType: dto.eventType,
        notes: dto.notes,
        tags: dto.tags || [],
        artistId: artist.id,
      },
    });
  }

  async findAllForArtist(userId: string, filters: any = {}) {
    const artist = await this.prisma.artist.findFirst({
      where: { profile: { userId } },
    });

    if (!artist) {
      throw new ForbiddenException('Artist profile not found');
    }

    const where: any = { artistId: artist.id };

    // Filtres optionnels
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.fromDate) {
      where.date = { gte: new Date(filters.fromDate) };
    }
    if (filters.toDate) {
      where.date = { ...where.date, lte: new Date(filters.toDate) };
    }
    if (filters.eventType) {
      where.eventType = filters.eventType;
    }

    return this.prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      include: {
        venue: true,
      },
    });
  }

  async getMonthlyCalendar(userId: string, year: number, month: number) {
    const artist = await this.prisma.artist.findFirst({
      where: { profile: { userId } },
    });

    if (!artist) {
      throw new ForbiddenException('Artist profile not found');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.prisma.event.findMany({
      where: {
        artistId: artist.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
      include: {
        venue: true,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            profile: true,
          },
        },
        venue: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Booking not found');
    }

    // Vérifier ownership
    if (event.artist.profile.userId !== userId) {
      throw new ForbiddenException('Not authorized to access this booking');
    }

    return event;
  }

  async update(userId: string, id: string, dto: UpdateBookingDto) {
    // Vérifier ownership d'abord
    await this.findOne(userId, id);

    const updateData: any = {};

    if (dto.title) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.date) updateData.date = new Date(dto.date);
    if (dto.endDate !== undefined) updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.budget !== undefined) updateData.budget = dto.budget;
    if (dto.status) updateData.status = dto.status as BookingStatus;
    if (dto.eventType) updateData.eventType = dto.eventType;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.tags !== undefined) updateData.tags = dto.tags;

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(userId: string, id: string) {
    // Vérifier ownership d'abord
    await this.findOne(userId, id);

    return this.prisma.event.delete({ where: { id } });
  }

  async exportToIcal(userId: string) {
    const bookings = await this.findAllForArtist(userId, {});

    // Génération iCal format simple
    const icalHeader = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//StageComplete//Artist Calendar//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:StageComplete - Mes Bookings',
      'X-WR-TIMEZONE:Europe/Paris',
    ].join('\r\n');

    const icalEvents = bookings.map((booking) => {
      const startDate = this.formatICalDate(booking.date);
      const endDate = booking.endDate
        ? this.formatICalDate(booking.endDate)
        : this.formatICalDate(new Date(booking.date.getTime() + 2 * 60 * 60 * 1000)); // +2h par défaut

      return [
        'BEGIN:VEVENT',
        `UID:${booking.id}@stagecomplete.com`,
        `DTSTAMP:${this.formatICalDate(new Date())}`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${this.escapeICalText(booking.title)}`,
        `DESCRIPTION:${this.escapeICalText(booking.description || '')}`,
        `LOCATION:${this.escapeICalText(booking.location || '')}`,
        `STATUS:${booking.status === 'CONFIRMED' || booking.status === 'ACCEPTED' ? 'CONFIRMED' : 'TENTATIVE'}`,
        'END:VEVENT',
      ].join('\r\n');
    }).join('\r\n');

    const icalFooter = 'END:VCALENDAR';

    return {
      content: `${icalHeader}\r\n${icalEvents}\r\n${icalFooter}`,
      filename: 'stagecomplete-bookings.ics',
    };
  }

  private formatICalDate(date: Date): string {
    // Format: YYYYMMDDTHHMMSSZ
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  private escapeICalText(text: string): string {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  }

  async getStats(userId: string) {
    const artist = await this.prisma.artist.findFirst({
      where: { profile: { userId } },
    });

    if (!artist) {
      throw new ForbiddenException('Artist profile not found');
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [total, upcoming, thisMonth, totalRevenue] = await Promise.all([
      this.prisma.event.count({
        where: { artistId: artist.id },
      }),
      this.prisma.event.count({
        where: {
          artistId: artist.id,
          date: { gte: now },
          status: { in: ['CONFIRMED', 'ACCEPTED', 'PENDING'] },
        },
      }),
      this.prisma.event.count({
        where: {
          artistId: artist.id,
          date: {
            gte: firstDayOfMonth,
            lt: firstDayOfNextMonth,
          },
        },
      }),
      this.prisma.event.aggregate({
        where: {
          artistId: artist.id,
          budget: { not: null },
        },
        _sum: {
          budget: true,
        },
      }),
    ]);

    return {
      total,
      upcoming,
      thisMonth,
      totalRevenue: totalRevenue._sum.budget || 0,
    };
  }
}
