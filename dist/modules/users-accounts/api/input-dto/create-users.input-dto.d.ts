import { CreateUserDto } from '../../dto/create-user.dto';
export declare class CreateUserInputDto implements CreateUserDto {
    login: string;
    password: string;
    email: string;
}
