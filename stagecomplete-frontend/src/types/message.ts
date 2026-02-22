export interface Message {
  id: string;
  content: string;
  senderId: string;
  eventId: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    email: string;
    role: string;
    profile: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
}

export interface CreateMessageDto {
  eventId: string;
  content: string;
}

export interface MessageUnreadCount {
  count: number;
  byEvent: Record<string, number>;
}

export interface Conversation {
  eventId: string;
  title: string;
  status: string;
  date: string;
  eventType: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    type: 'artist' | 'venue';
  };
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  } | null;
  bookingRequest: {
    id: string;
    status: string;
    message: string;
    budget?: number;
    duration?: number;
  } | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}
