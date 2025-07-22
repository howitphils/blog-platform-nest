import { UsersQueryRepository } from './../infrastructure/users-query.repository';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input';
export declare class UsersController {
    private usersService;
    private usersQueryRepository;
    constructor(usersService: UsersService, usersQueryRepository: UsersQueryRepository);
    getUsers(query: GetUsersQueryParams): Promise<import("../../../core/dto/base.pagination-view").PaginatedViewModel<import("./view-dto/user.view-dto").UserViewDto>>;
    createUser(body: CreateUserInputDto): Promise<import("./view-dto/user.view-dto").UserViewDto>;
    deleteUser(id: string): Promise<void>;
}
