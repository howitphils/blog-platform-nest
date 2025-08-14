import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { appSettings } from '../../../app.settings';
import { JwtRefreshAuthGuard } from '../guards/bearer/jwt-refresh-token.auth-guard';
import { GetAllSessionsQuery } from '../application/queries/get-all-sessions.query';
import { DeleteAllSessionsCommand } from '../application/use-cases/sessions/delete-all-sessions.use-case';
import { DeleteSessionCommand } from '../application/use-cases/sessions/delete-session.use-case';

@Controller(appSettings.MAIN_PATHS.SECURITY)
@UseGuards(JwtRefreshAuthGuard)
export class SessionsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(appSettings.ENDPOINT_PATHS.DEVICES.GET_DEVICES)
  async getAllSessions(@Req() req: RequestWithRefreshUser) {
    await this.queryBus.execute(new GetAllSessionsQuery(req.user.id));
  }

  @Delete(appSettings.ENDPOINT_PATHS.DEVICES.DELETE_DEVICES)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessions(@Req() req: RequestWithRefreshUser) {
    await this.commandBus.execute(
      new DeleteAllSessionsCommand(req.user.id, req.user.deviceId),
    );
  }

  @Delete(appSettings.ENDPOINT_PATHS.DEVICES.DELETE_DEVICE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(@Req() req: RequestWithRefreshUser) {
    await this.commandBus.execute(
      new DeleteSessionCommand(req.user.id, req.user.deviceId),
    );
  }
}
