export class EmailResendingEvent {
  constructor(
    public email: string,
    public confirmationCode: string,
  ) {}
}
