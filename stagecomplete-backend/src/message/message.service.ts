import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { NewMessageEvent } from '../notification/events/message.events';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateMessageDto) {
    // Vérifier que l'event existe et que l'user a accès
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: {
        artist: { include: { profile: true } },
        venue: { include: { profile: true } },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Vérifier que l'user est soit l'artiste soit la venue
    const isArtist = event.artist.profile.userId === userId;
    const isVenue = event.venue?.profile.userId === userId;

    if (!isArtist && !isVenue) {
      throw new ForbiddenException('Not authorized to send messages for this event');
    }

    // Créer le message
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        senderId: userId,
        eventId: dto.eventId,
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });

    // Déterminer le destinataire et émettre l'événement
    const recipientUserId = isArtist ? event.venue?.profile.userId : event.artist.profile.userId;

    if (recipientUserId) {
      this.eventEmitter.emit(
        'message.new',
        new NewMessageEvent(
          recipientUserId,
          userId,
          message.id,
          message.sender.profile!.name,
          dto.eventId,
          dto.content,
        ),
      );
    }

    return message;
  }

  async findByEvent(userId: string, eventId: string) {
    // Vérifier accès à l'event
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        artist: { include: { profile: true } },
        venue: { include: { profile: true } },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isArtist = event.artist.profile.userId === userId;
    const isVenue = event.venue?.profile.userId === userId;

    if (!isArtist && !isVenue) {
      throw new ForbiddenException('Not authorized to view messages for this event');
    }

    return this.prisma.message.findMany({
      where: { eventId },
      include: {
        sender: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markAsRead(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        event: {
          include: {
            artist: { include: { profile: true } },
            venue: { include: { profile: true } },
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Vérifier que l'user est le destinataire (pas l'envoyeur)
    if (message.senderId === userId) {
      throw new ForbiddenException('Cannot mark own message as read');
    }

    const isArtist = message.event.artist.profile.userId === userId;
    const isVenue = message.event.venue?.profile.userId === userId;

    if (!isArtist && !isVenue) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string, eventId: string) {
    // Vérifier que l'event existe et que l'user y est impliqué
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        artist: { include: { profile: true } },
        venue: { include: { profile: true } },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isArtist = event.artist.profile.userId === userId;
    const isVenue = event.venue?.profile.userId === userId;

    if (!isArtist && !isVenue) {
      throw new ForbiddenException('Not authorized');
    }

    // Marquer tous les messages non-lus envoyés par l'autre partie
    const result = await this.prisma.message.updateMany({
      where: {
        eventId,
        isRead: false,
        senderId: { not: userId },
      },
      data: { isRead: true },
    });

    return { updated: result.count };
  }

  async getUnreadCount(userId: string) {
    // Trouver tous les events où l'user est impliqué
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { artist: true, venue: true },
    });

    if (!userProfile) {
      return { count: 0, byEvent: {} };
    }

    const events = await this.prisma.event.findMany({
      where: {
        OR: [
          { artistId: userProfile.artist?.id },
          { venueId: userProfile.venue?.id },
        ],
      },
      include: {
        messages: {
          where: {
            isRead: false,
            senderId: { not: userId },
          },
        },
      },
    });

    const byEvent: Record<string, number> = {};
    let totalCount = 0;

    events.forEach((event) => {
      byEvent[event.id] = event.messages.length;
      totalCount += event.messages.length;
    });

    return { count: totalCount, byEvent };
  }

  async getConversations(userId: string) {
    // Trouver le profil de l'utilisateur
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { artist: true, venue: true },
    });

    if (!userProfile) {
      throw new NotFoundException('Profile not found');
    }

    // Récupérer tous les events où l'user est impliqué (incluant PENDING pour les booking requests)
    const events = await this.prisma.event.findMany({
      where: {
        OR: [
          { artistId: userProfile.artist?.id },
          { venueId: userProfile.venue?.id },
        ],
      },
      include: {
        artist: {
          include: { profile: true },
        },
        venue: {
          include: { profile: true },
        },
        bookingRequest: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Dernier message seulement pour le preview
          include: {
            sender: {
              include: { profile: true },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId },
              },
            },
          },
        },
      },
      orderBy: [
        // Trier par dernière activité (dernier message ou date de création)
        { updatedAt: 'desc' },
      ],
    });

    // Formater les conversations
    return events.map((event) => ({
      eventId: event.id,
      title: event.title,
      status: event.status,
      date: event.date,
      eventType: event.eventType,

      // Participant info (artiste ou venue selon le rôle de l'user)
      participant: {
        id: userProfile.artist ? event.venue?.profile.userId : event.artist.profile.userId,
        name: userProfile.artist ? event.venue?.profile.name : event.artist.profile.name,
        avatar: userProfile.artist ? event.venue?.profile.avatar : event.artist.profile.avatar,
        type: userProfile.artist ? 'venue' : 'artist',
      },

      // Dernier message
      lastMessage: event.messages[0] ? {
        id: event.messages[0].id,
        content: event.messages[0].content,
        senderId: event.messages[0].senderId,
        senderName: event.messages[0].sender.profile?.name,
        createdAt: event.messages[0].createdAt,
      } : null,

      // Booking request associée
      bookingRequest: event.bookingRequest ? {
        id: event.bookingRequest.id,
        status: event.bookingRequest.status,
        message: event.bookingRequest.message,
        budget: event.bookingRequest.budget,
        duration: event.bookingRequest.duration,
      } : null,

      // Compteur de messages non lus
      unreadCount: event._count.messages,

      // Métadonnées
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));
  }
}
