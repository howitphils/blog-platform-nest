import { SessionDbDocument } from '../../domain/session.entity';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetAllSessionsQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetAllSessionsQuery)
export class GetMyInfoHandler implements IQueryHandler<GetAllSessionsQuery> {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(query: GetAllSessionsQuery): Promise<SessionDbDocument[]> {
    return this.sessionsRepository.findAllUsersSessions(query.userId);
  }
}
