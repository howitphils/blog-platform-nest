import { UserModelType } from '../users-accounts/domain/user.entity';
export declare class TestingAllDataController {
    private UserModel;
    constructor(UserModel: UserModelType);
    removeAllData(): Promise<void>;
}
