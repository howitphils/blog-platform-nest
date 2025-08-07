import { UsersQueryRepository } from './../../infrastructure/users-query.repository';
import { QueryHandler } from '@nestjs/cqrs';

export class GetMyInfoQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetMyInfoQuery)
export class GetMyInfoHandler {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(dto: GetMyInfoQuery) {
    return this.usersQueryRepository.getMyInfoOrFail(dto.userId);
  }
}
