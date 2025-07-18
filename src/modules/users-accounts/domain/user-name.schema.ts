import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Name {
  @Prop({ type: String, required: true, minlength: 3, maxlength: 20 })
  firstName: string;

  @Prop({ type: String, default: null })
  lastName: string | null;
}

export const NameSchema = SchemaFactory.createForClass(Name);
