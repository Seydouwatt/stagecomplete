export class NewMessageEvent {
  constructor(
    public readonly recipientUserId: string,
    public readonly senderUserId: string,
    public readonly messageId: string,
    public readonly senderName: string,
    public readonly eventId: string,
    public readonly content: string,
  ) {}
}
