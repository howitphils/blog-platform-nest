export class CreateSessionDomainDto {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
  ip: string;
  deviceName: string;
}
