import { UserDbDocument, UserModelType } from '../domain/user.entity';
export declare class UsersRepository {
    private UserModel;
    constructor(UserModel: UserModelType);
    getUserById(id: string): Promise<UserDbDocument>;
    save(user: UserDbDocument): Promise<string>;
}
