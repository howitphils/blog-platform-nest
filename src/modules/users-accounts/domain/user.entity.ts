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
import { randomUUID } from 'crypto';
import { addDays } from 'date-fns';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

export const loginConstraints = {
  minLength: 3,
  maxLength: 10,
};

export const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: UserAccountDataSchema, default: {} })
  accountData: AccountData;

  @Prop({ type: EmailConfirmationSchema, default: {} })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecoverySchema, default: {} })
  passwordRecovery: PasswordRecovery;

  static createUser(dto: CreateUserDomainDto): UserDbDocument {
    const user = new this();

    user.accountData.email = dto.email;
    user.accountData.passwordHash = dto.passwordHash;
    user.accountData.login = dto.login;

    user.emailConfirmation.confirmationCode = randomUUID();
    user.emailConfirmation.expirationDate = addDays(new Date(), 2);

    user.passwordRecovery.recoveryCode = randomUUID();
    user.passwordRecovery.expirationDate = addDays(new Date(), 2);

    return user as UserDbDocument;
  }

  makeDeleted() {
    if (this.accountData.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.accountData.deletedAt = new Date();
  }

  confirmRegistration() {
    if (this.emailConfirmation.expirationDate < new Date()) {
      throw new DomainException(
        'Confirmation code already expired',
        DomainExceptionCodes.BadRequest,
        [{ field: 'confirmationCode', message: 'Code expired' }],
      );
    }

    if (this.emailConfirmation.isConfirmed) {
      throw new DomainException(
        'Email already confirmed',
        DomainExceptionCodes.BadRequest,
        [{ field: 'email', message: 'email already confirmed' }],
      );
    }

    this.emailConfirmation.isConfirmed = true;
  }

  updateEmailConfirmationCode() {
    this.emailConfirmation.confirmationCode = randomUUID();
    this.emailConfirmation.expirationDate = addDays(new Date(), 2);
  }

  confirmPasswordRecovery(newPasswordHash: string) {
    this.accountData.passwordHash = newPasswordHash;
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
