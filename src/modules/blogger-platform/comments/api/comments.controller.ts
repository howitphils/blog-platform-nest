import { UpdateCommentLikeStatusInputDto } from './input-dto/update-like-status.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { appConfig } from '../../../../app.config';
import { JwtAuthGuard } from '../../../users-accounts/guards/bearer/jwt-auth.guard';
import { IsValidObjectId } from '../../../../core/decorators/validation/object-id.validator';
import { Public } from '../../../users-accounts/guards/basic/decorators/public.decorator';
import { UpdateCommentInputDto } from './input-dto/update-comment.input-dto';
import { GetCommentQuery } from '../application/queries/get-comment.query';
import { CommentViewDto } from '../application/queries/dto/comment.view-dto';

@Controller(appConfig.MAIN_PATHS.COMMENTS)
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  // TODO: Optional guard
  @Public()
  @Get(':id')
  async getCommentById(
    @Req() req: RequestWithUser,
    @Param('id', IsValidObjectId) id: string,
  ) {
    return this.queryBus.execute<GetCommentQuery, CommentViewDto>(
      new GetCommentQuery(id, req.user.id),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Req() req: RequestWithUser,
    @Param('id', IsValidObjectId) id: string,
    @Body() dto: UpdateCommentInputDto,
  ) {}

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentsLikeStatus(
    @Req() req: RequestWithUser,
    @Body() updatedLikeStatus: UpdateCommentLikeStatusInputDto,
    @Param('id', IsValidObjectId) id: string,
  ) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Req() req: RequestWithUser,
    @Param('id', IsValidObjectId) id: string,
  ) {}
}
