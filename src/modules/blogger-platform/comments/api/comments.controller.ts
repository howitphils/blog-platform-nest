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
import { UpdateCommentCommand } from '../application/use-cases/update-comment.use-case';
import { JwtAuthOptionalGuard } from '../../../users-accounts/guards/bearer/jwt-auth.optional-guard';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment.use-case';
import { UpdateCommentsLikeStatusCommand } from '../application/use-cases/update-comments-like-status.use-case';

@Controller(appConfig.MAIN_PATHS.COMMENTS)
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Public()
  @UseGuards(JwtAuthOptionalGuard)
  @Get(':id')
  async getCommentById(
    @Req() req: RequestWithOptionalUser,
    @Param('id', IsValidObjectId) id: string,
  ) {
    const userId = req.user ? req.user.id : null;

    return this.queryBus.execute<GetCommentQuery, CommentViewDto>(
      new GetCommentQuery(id, userId),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Req() req: RequestWithUser,
    @Param('id', IsValidObjectId) id: string,
    @Body() dto: UpdateCommentInputDto,
  ) {
    return this.commandBus.execute<UpdateCommentCommand, void>(
      new UpdateCommentCommand({
        commentId: id,
        content: dto.content,
        userId: req.user.id,
      }),
    );
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentsLikeStatus(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateCommentLikeStatusInputDto,
    @Param('id', IsValidObjectId) id: string,
  ) {
    return this.commandBus.execute<UpdateCommentsLikeStatusCommand, void>(
      new UpdateCommentsLikeStatusCommand({
        commentId: id,
        likeStatus: dto.likeStatus,
        userId: req.user.id,
      }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Req() req: RequestWithUser,
    @Param('id', IsValidObjectId) id: string,
  ) {
    return this.commandBus.execute<DeleteCommentCommand, void>(
      new DeleteCommentCommand({ commentId: id, userId: req.user.id }),
    );
  }
}
