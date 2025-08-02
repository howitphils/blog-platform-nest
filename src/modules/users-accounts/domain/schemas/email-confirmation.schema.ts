import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EmailConfirmation {
  @Prop({
    type: String,
    required: true,
  })
  confirmationCode: string;

  @Prop({ type: Date, required: true })
  expirationDate: Date;

  @Prop({ type: Boolean, required: true, default: false })
  isConfirmed: boolean;

  static createInstance(code: string, exp: Date) {
    const emailConf = new EmailConfirmation();

    emailConf.expirationDate = exp;
    emailConf.confirmationCode = code;
    emailConf.isConfirmed = false;

    return emailConf;
  }
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
