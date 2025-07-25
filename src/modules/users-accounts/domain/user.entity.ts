import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';

@Schema({ timestamps: true, collection: 'users' })
export class User {
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

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

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

  static createUser(dto: CreateUserDomainDto): UserDbDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;

    return user as UserDbDocument;
  }

  /**
   * Marks the user as deleted
   * Throws an error if already deleted
   * @throws {Error} If the entity is already deleted
   * DDD continue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
   */
  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
}

export type UserDbDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

// Типизация модели + статические методы (берутся из класса User)
export type UserModelType = Model<UserDbDocument> & typeof User;

UserSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

UserSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
