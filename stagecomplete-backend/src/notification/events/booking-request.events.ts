export class BookingRequestReceivedEvent {
  constructor(
    public readonly artistUserId: string,
    public readonly venueUserId: string,
    public readonly bookingRequestId: string,
    public readonly venueName: string,
    public readonly eventDate: Date,
    public readonly eventType: string,
  ) {}
}

export class BookingRequestAcceptedEvent {
  constructor(
    public readonly venueUserId: string,
    public readonly artistUserId: string,
    public readonly bookingRequestId: string,
    public readonly artistName: string,
    public readonly eventDate: Date,
    public readonly eventId: string,
  ) {}
}

export class BookingRequestDeclinedEvent {
  constructor(
    public readonly venueUserId: string,
    public readonly artistUserId: string,
    public readonly bookingRequestId: string,
    public readonly artistName: string,
  ) {}
}

export class BookingRequestCancelledEvent {
  constructor(
    public readonly artistUserId: string,
    public readonly venueUserId: string,
    public readonly bookingRequestId: string,
    public readonly venueName: string,
  ) {}
}
