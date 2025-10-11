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
