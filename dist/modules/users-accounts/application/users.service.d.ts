import { UsersRepository } from './../infrastructure/users.respository';
import { UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { BcryptService } from '../infrastructure/adapters/bcrypt.adapter';
export declare class UsersService {
    private UserModel;
    private usersRepository;
    private bcryptService;
    constructor(UserModel: UserModelType, usersRepository: UsersRepository, bcryptService: BcryptService);
    createUser(dto: CreateUserDto): Promise<string>;
    deleteUser(id: string): Promise<void>;
}
