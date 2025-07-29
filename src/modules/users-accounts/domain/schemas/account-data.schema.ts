import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: true })
export class AccountData {
  @Prop({
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 20,
  })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, minlength: 6, maxlength: 100 })
  email: string;

  // Дата для софт удаления
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
}

export const UserAccountDataSchema = SchemaFactory.createForClass(AccountData);
