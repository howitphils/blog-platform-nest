import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: true })
export class AccountData {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 20,
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

  /**
   * Creation timestamp
   * Explicitly defined despite timestamps: true
   * properties without @Prop for typescript so that they are in the class instance (or in instance methods)
   * @type {Date}
   */
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
