import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Name, NameSchema } from './user-name.schema';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';

@Schema({ timestamps: true })
export class User {
  /**
   * Login of the user (must be uniq)
   * @type {string}
   * @required
   */
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 20,
  })
  login: string;

  /**
   * Password hash for authentication
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  passwordHash: string;

  /**
   * Email of the user
    @type {string}
   @required
   */
  @Prop({ type: String, required: true, minlength: 10 })
  email: string;

  /**
   * Email confirmation status (if not confirmed in 2 days account will be deleted)
   * @type {boolean}
   * @default false
   */
  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  // @Prop(NameSchema) this variant from doc. doesn't make validation for inner object
  @Prop({ type: NameSchema })
  name: Name;

  /**
   * Creation timestamp
   * Explicitly defined despite timestamps: true
   * properties without @Prop for typescript so that they are in the class instance (or in instance methods)
   * @type {Date}
   */
  createdAt: Date;
  updatedAt: Date;

  /**
   * Deletion timestamp, nullable, if date exist, means entity soft deleted
   * @type {Date | null}
   */
  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(dto: CreateUserDomainDto): UserDbDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
    user.isEmailConfirmed = false; // пользователь ВСЕГДА должен после регистрации подтверждить свой Email

    user.name = {
      firstName: 'firstName xxx',
      lastName: 'lastName yyy',
    };

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

// Типизация модели + статические методы
export type UserModelType = Model<UserDbDocument> & typeof User;
