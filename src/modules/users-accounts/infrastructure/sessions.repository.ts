import { InjectModel } from '@nestjs/mongoose';
import {
  Session,
  SessionDbDocument,
  SessionModelType,
} from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'mongoose';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async save(session: SessionDbDocument) {
    const result = await session.save();
    return result._id.toString();
  }

  async deleteAllSessions(
    userId: string,
    deviceId: string,
  ): Promise<DeleteResult> {
    return this.SessionModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async findByDeviceIdAndIssuedAt(
    iat: number,
    deviceId: string,
  ): Promise<SessionDbDocument | null> {
    return this.SessionModel.findOne({ $and: [{ iat }, { deviceId }] });
  }

  async findByDeviceId(deviceId: string): Promise<SessionDbDocument | null> {
    return this.SessionModel.findOne({ deviceId });
  }

  async findAllUsersSessions(userId: string): Promise<SessionDbDocument[]> {
    return this.SessionModel.find({ userId });
  }
}
