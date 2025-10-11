export type BookingRequestStatus =
  | 'PENDING'
  | 'VIEWED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface BookingRequest {
  id: string;
  venueId: string;
  artistId: string;
  eventDate: string;
  eventType: string;
  budget?: number;
  duration?: number;
  message?: string;
  status: BookingRequestStatus;
  viewedByArtist: boolean;
  respondedAt?: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
  venue: {
    id: string;
    profile: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  artist: {
    id: string;
    profile: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  event?: {
    id: string;
    title: string;
    date: string;
  };
}

export interface CreateBookingRequestDto {
  artistId: string;
  eventDate: string;
  eventType: string;
  budget?: number;
  duration?: number;
  message?: string;
}

export interface RespondBookingRequestDto {
  action: 'accept' | 'decline' | 'cancel';
  reason?: string;
}

export interface BookingRequestStats {
  pending: number;
  accepted: number;
  declined: number;
}
