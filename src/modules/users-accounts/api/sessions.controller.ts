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

@Controller(appSettings.MAIN_PATHS.SECURITY)
export class SessionsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(appSettings.ENDPOINT_PATHS.DEVICES.GET_DEVICES)
  @UseGuards()
  async getAllSessions() {}

  @Delete(appSettings.ENDPOINT_PATHS.DEVICES.DELETE_DEVICES)
  @UseGuards()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessions() {}

  @Delete(appSettings.ENDPOINT_PATHS.DEVICES.DELETE_DEVICE)
  @UseGuards()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession() {}
}
