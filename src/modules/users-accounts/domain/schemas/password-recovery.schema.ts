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

  static createInstance(code: string, exp: Date) {
    const passRec = new PasswordRecovery();

    passRec.expirationDate = exp;
    passRec.recoveryCode = code;

    return passRec;
  }
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
