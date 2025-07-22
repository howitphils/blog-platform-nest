import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
export declare class User {
    login: string;
    passwordHash: string;
    email: string;
    isEmailConfirmed: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    static createInstance(dto: CreateUserDomainDto): UserDbDocument;
    makeDeleted(): void;
}
export type UserDbDocument = HydratedDocument<User>;
export declare const UserSchema: import("mongoose").Schema<User, Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type UserModelType = Model<UserDbDocument> & typeof User;
