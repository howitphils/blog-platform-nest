import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { appSettings } from '../../../app.settings';
import { JwtRefreshAuthGuard } from '../guards/bearer/jwt-refresh-token.auth-guard';

@Controller(appSettings.MAIN_PATHS.SECURITY)
@UseGuards(JwtRefreshAuthGuard)
export class SessionsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(appSettings.ENDPOINT_PATHS.DEVICES.GET_DEVICES)
  async getAllSessions() {}

  @Delete(appSettings.ENDPOINT_PATHS.DEVICES.DELETE_DEVICES)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessions() {}

  @Delete(appSettings.ENDPOINT_PATHS.DEVICES.DELETE_DEVICE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession() {}
}
