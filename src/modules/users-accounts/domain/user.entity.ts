import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import {
  AccountData,
  UserAccountDataSchema,
} from './schemas/account-data.schema';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './schemas/email-confirmation.schema';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: UserAccountDataSchema })
  accountData: AccountData;

  @Prop({ type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;

  static createUser(dto: CreateUserDomainDto): UserDbDocument {
    const user = new this();
    user.accountData.email = dto.email;
    user.accountData.passwordHash = dto.passwordHash;
    user.accountData.login = dto.login;

    return user as UserDbDocument;
  }

  /**
   * Marks the user as deleted
   * Throws an error if already deleted
   * @throws {Error} If the entity is already deleted
   * DDD continue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
   */
  makeDeleted() {
    if (this.accountData.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.accountData.deletedAt = new Date();
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
