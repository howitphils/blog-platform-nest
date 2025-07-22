import { UserDbDocument } from '../../domain/user.entity';
export declare class UserViewDto {
    id: string;
    email: string;
    login: string;
    createdAt: Date;
    static mapToView(user: UserDbDocument): UserViewDto;
}
