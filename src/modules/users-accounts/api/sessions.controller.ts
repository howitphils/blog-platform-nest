import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { appSettings } from '../../../app.settings';
import { JwtRefreshAuthGuard } from '../guards/bearer/jwt-refresh-token.auth-guard';
import { GetAllSessionsQuery } from '../application/queries/get-all-sessions.query';
import { DeleteAllSessionsCommand } from '../application/use-cases/sessions/delete-all-sessions.use-case';
import { DeleteSessionCommand } from '../application/use-cases/sessions/delete-session.use-case';
import { SessionViewDto } from '../application/queries/dto/session.view-dto';

@Controller(appSettings.MAIN_PATHS.SECURITY)
@UseGuards(JwtRefreshAuthGuard)
export class SessionsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('devices')
  async getAllSessions(@Req() req: RequestWithRefreshUser) {
    return this.queryBus.execute<GetAllSessionsQuery, SessionViewDto[]>(
      new GetAllSessionsQuery(req.user.id),
    );
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessions(@Req() req: RequestWithRefreshUser) {
    return this.commandBus.execute<DeleteAllSessionsCommand, void>(
      new DeleteAllSessionsCommand(req.user.id, req.user.deviceId),
    );
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(
    @Req() req: RequestWithRefreshUser,
    @Param('id') id: string,
  ) {
    return this.commandBus.execute<DeleteSessionCommand, void>(
      new DeleteSessionCommand(req.user.id, id),
    );
  }
}
