import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { loginConstraints } from '../user.entity';

@Schema({ _id: false, timestamps: true })
export class AccountData {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: loginConstraints.maxLength,
  })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 100,
  })
  email: string;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(login: string, passwordHash: string, email: string) {
    const accData = new AccountData();

    accData.login = login;
    accData.passwordHash = passwordHash;
    accData.email = email;

    return accData;
  }
}

export const UserAccountDataSchema = SchemaFactory.createForClass(AccountData);
