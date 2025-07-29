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
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './schemas/password-recovery.schema';

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: UserAccountDataSchema })
  accountData: AccountData;

  @Prop({ type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecoverySchema })
  passwordRecovery: PasswordRecovery;

  static createUser(dto: CreateUserDomainDto): UserDbDocument {
    const user = new this();
    user.accountData.email = dto.email;
    user.accountData.passwordHash = dto.passwordHash;
    user.accountData.login = dto.login;

    return user as UserDbDocument;
  }

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
