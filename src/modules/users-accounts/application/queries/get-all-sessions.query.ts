import { UsersQueryRepository } from './../../infrastructure/users-query.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionViewDto } from './dto/session.view-dto';

export class GetAllSessionsQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetAllSessionsQuery)
export class GetMyInfoHandler implements IQueryHandler<GetAllSessionsQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(query: GetAllSessionsQuery): Promise<SessionViewDto[]> {
    return this.usersQueryRepository.getAllUsersSessions(query.userId);
  }
}
