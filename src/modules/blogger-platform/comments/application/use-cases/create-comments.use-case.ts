import { CommentModelType } from './../../domain/comment.entity';
import { CommentsRepository } from './../../infrastructure/comments.repository';
import { PostsService } from './../../../posts/application/posts.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception.codes';
import { UsersService } from '../../../../users-accounts/application/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/comment.entity';

export class CreateCommentCommand {
  constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private postsService: PostsService,
    private usersService: UsersService,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute({ dto }: CreateCommentCommand): Promise<string> {
    const targetPost = await this.postsService.getPostById(dto.postId);

    if (!targetPost) {
      throw new DomainException(
        'Post not found',
        DomainExceptionCodes.NotFound,
      );
    }

    const targetUser = await this.usersService.getUserById(dto.userId);

    if (!targetUser) {
      throw new DomainException(
        'User not found',
        DomainExceptionCodes.NotFound,
      );
    }

    const newComment = this.CommentModel.createInstance({
      content: dto.content,
      userId: dto.userId,
      userLogin: targetUser.accountData.login,
    });

    return this.commentsRepository.save(newComment);
  }
}
