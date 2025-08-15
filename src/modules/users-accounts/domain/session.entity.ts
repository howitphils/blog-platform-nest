import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { addPreFilter } from '../../../core/utils/add-pre-filter';
import { CreateSessionDomainDto } from './dto/create-session.domain-dto';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception.codes';

@Schema({ timestamps: true, collection: 'sessions' })
export class Session {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: Number, required: true })
  iat: number;

  @Prop({ type: Number, required: true })
  exp: number;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  deviceName: string;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  static createSession(dto: CreateSessionDomainDto): SessionDbDocument {
    const newSession = new this();

    newSession.userId = dto.userId;
    newSession.deviceId = dto.deviceId;
    newSession.iat = dto.iat;
    newSession.exp = dto.exp;
    newSession.ip = dto.ip;
    newSession.deviceName = dto.deviceName;

    return newSession as SessionDbDocument;
  }

  makeDeleted(userId: string) {
    if (this.userId !== userId) {
      throw new DomainException(
        'Forbidden action',
        DomainExceptionCodes.Forbidden,
      );
    }

    if (this.deletedAt !== null) {
      throw new Error('Session already deleted');
    }

    this.deletedAt = new Date();
  }

  updateIatAndExp(iat: number, exp: number) {
    this.iat = iat;
    this.exp = exp;
  }
}

export type SessionDbDocument = HydratedDocument<Session>;

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.loadClass(Session);
addPreFilter(SessionSchema, 'deletedAt');

export type SessionModelType = Model<SessionDbDocument> & typeof Session;
