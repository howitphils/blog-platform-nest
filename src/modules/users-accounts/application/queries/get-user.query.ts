import { UsersQueryRepository } from './../../infrastructure/users-query.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetUserQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(dto: GetUserQuery) {
    return this.usersQueryRepository.getUserByIdOrFail(dto.userId);
  }
}
