import { HydratedDocument } from 'mongoose';
export declare class NewestLike {
    addedAt: string;
    userId: string;
    login: string;
}
export type NewestLikeDbDocument = HydratedDocument<NewestLike>;
export declare const NewestLikeSchema: import("mongoose").Schema<NewestLike, import("mongoose").Model<NewestLike, any, any, any, import("mongoose").Document<unknown, any, NewestLike, any> & NewestLike & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NewestLike, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<NewestLike>, {}> & import("mongoose").FlatRecord<NewestLike> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
