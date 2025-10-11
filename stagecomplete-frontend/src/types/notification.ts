export type NotificationType =
  | 'BOOKING_REQUEST_RECEIVED'
  | 'BOOKING_REQUEST_ACCEPTED'
  | 'BOOKING_REQUEST_DECLINED'
  | 'NEW_MESSAGE'
  | 'BOOKING_REMINDER';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationUnreadCount {
  count: number;
}
