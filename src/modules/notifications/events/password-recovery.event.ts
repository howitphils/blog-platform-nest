export class PasswordRecoveryEvent {
  constructor(
    public email: string,
    public recoveryCode: string,
  ) {}
}
