import { SessionDbDocument } from '../../../domain/session.entity';

export class SessionViewDto {
  deviceId: string;
  ip: string;
  lastActiveDate: string;
  title: string;

  static mapToView(dto: SessionDbDocument): SessionViewDto {
    const sessionView = new SessionViewDto();

    sessionView.deviceId = dto.deviceId;
    sessionView.ip = dto.ip;
    sessionView.lastActiveDate = new Date(dto.iat).toISOString();
    sessionView.title = dto.deviceName;

    return sessionView;
  }
}
