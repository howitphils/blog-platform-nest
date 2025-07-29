import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PasswordRecovery {
  @Prop({
    type: String,
    required: true,
  })
  recoveryCode: string;

  @Prop({ type: Date, required: true })
  expirationDate: Date;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
