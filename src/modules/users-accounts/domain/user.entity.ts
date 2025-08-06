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
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception.codes';
import { ErrorsMessages } from '../../../core/exceptions/errorsMessages';

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
  @Prop({ type: UserAccountDataSchema })
  accountData: AccountData;

  @Prop({ type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecoverySchema })
  passwordRecovery: PasswordRecovery;

  static createUser(dto: CreateUserDomainDto): UserDbDocument {
    const user = new this();

    user.accountData = AccountData.createInstance(
      dto.login,
      dto.passwordHash,
      dto.email,
    );

    user.emailConfirmation = EmailConfirmation.createInstance(
      randomUUID(),
      addDays(new Date(), 2),
    );

    user.passwordRecovery = PasswordRecovery.createInstance(
      randomUUID(),
      addDays(new Date(), 2),
    );

    return user as UserDbDocument;
  }

  makeDeleted() {
    if (this.accountData.deletedAt !== null) {
      throw new DomainException(
        'User already deleted',
        DomainExceptionCodes.BadRequest,
      );
    }
    this.accountData.deletedAt = new Date();
  }

  confirmRegistration() {
    if (this.emailConfirmation.expirationDate < new Date()) {
      throw new DomainException(
        'Confirmation failed',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance('code', 'Code expired'),
      );
    }

    if (this.emailConfirmation.isConfirmed) {
      throw new DomainException(
        'Confirmation failed',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance('code', 'email already confirmed'),
      );
    }

    this.emailConfirmation.isConfirmed = true;
  }

  updateEmailConfirmationCode() {
    if (this.emailConfirmation.isConfirmed) {
      throw new DomainException(
        'Confirmation resending failed',
        DomainExceptionCodes.BadRequest,
        ErrorsMessages.createInstance('email', 'email already confirmed'),
      );
    }

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
  this.where({ 'accountData.deletedAt': null });
});

UserSchema.pre('findOne', function () {
  this.where({ 'accountData.deletedAt': null });
});
