import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class NewestLike {
  @Prop({ type: String, required: true })
  addedAt: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  login: string;
}

export type NewestLikeDbDocument = HydratedDocument<NewestLike>;

export const NewestLikeSchema = SchemaFactory.createForClass(NewestLike);
