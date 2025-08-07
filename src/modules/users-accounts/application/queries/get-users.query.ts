import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input';
import { UsersQueryRepository } from '../../infrastructure/users-query.repository';
import { QueryHandler } from '@nestjs/cqrs';

export class GetUsersQuery {
  constructor(public dto: GetUsersQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({ dto }: GetUsersQuery) {
    return this.usersQueryRepository.getUsers(dto);
  }
}
