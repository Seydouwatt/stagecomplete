import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import {
  BookingRequestReceivedEvent,
  BookingRequestAcceptedEvent,
  BookingRequestDeclinedEvent,
  BookingRequestCancelledEvent,
} from './events/booking-request.events';
import { NewMessageEvent } from './events/message.events';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // Event listeners
  @OnEvent('booking-request.received')
  async handleBookingRequestReceived(event: BookingRequestReceivedEvent) {
    await this.prisma.notification.create({
      data: {
        userId: event.artistUserId,
        type: 'BOOKING_REQUEST_RECEIVED',
        title: 'Nouvelle demande de réservation',
        message: `${event.venueName} vous a envoyé une demande de réservation pour un ${event.eventType} le ${event.eventDate.toLocaleDateString('fr-FR')}`,
        relatedId: event.bookingRequestId,
        relatedType: 'BOOKING_REQUEST',
      },
    });
  }

  @OnEvent('booking-request.accepted')
  async handleBookingRequestAccepted(event: BookingRequestAcceptedEvent) {
    await this.prisma.notification.create({
      data: {
        userId: event.venueUserId,
        type: 'BOOKING_REQUEST_ACCEPTED',
        title: 'Demande acceptée',
        message: `${event.artistName} a accepté votre demande de réservation pour le ${event.eventDate.toLocaleDateString('fr-FR')}`,
        relatedId: event.eventId,
        relatedType: 'EVENT',
      },
    });
  }

  @OnEvent('booking-request.declined')
  async handleBookingRequestDeclined(event: BookingRequestDeclinedEvent) {
    await this.prisma.notification.create({
      data: {
        userId: event.venueUserId,
        type: 'BOOKING_REQUEST_DECLINED',
        title: 'Demande refusée',
        message: `${event.artistName} a décliné votre demande de réservation`,
        relatedId: event.bookingRequestId,
        relatedType: 'BOOKING_REQUEST',
      },
    });
  }

  @OnEvent('booking-request.cancelled')
  async handleBookingRequestCancelled(event: BookingRequestCancelledEvent) {
    await this.prisma.notification.create({
      data: {
        userId: event.artistUserId,
        type: 'BOOKING_REQUEST_DECLINED',
        title: 'Demande annulée',
        message: `${event.venueName} a annulé sa demande de réservation`,
        relatedId: event.bookingRequestId,
        relatedType: 'BOOKING_REQUEST',
      },
    });
  }

  @OnEvent('message.new')
  async handleNewMessage(event: NewMessageEvent) {
    await this.prisma.notification.create({
      data: {
        userId: event.recipientUserId,
        type: 'NEW_MESSAGE',
        title: 'Nouveau message',
        message: `${event.senderName}: ${event.content.substring(0, 50)}${event.content.length > 50 ? '...' : ''}`,
        relatedId: event.eventId,
        relatedType: 'EVENT',
      },
    });
  }

  // CRUD methods
  async findAll(userId: string, filters?: { isRead?: boolean }) {
    const where: any = { userId };

    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    // Verify ownership
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { count };
  }

  async delete(userId: string, notificationId: string) {
    // Verify ownership
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}
