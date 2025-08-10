import { PostsRepository } from './../../../posts/infrastructure/posts.repository';
import { UsersExternalRepository } from './../../../../users-accounts/infrastructure/users.external-repository';
import { CommentModelType } from './../../domain/comment.entity';
import { CommentsRepository } from './../../infrastructure/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

export class CreateCommentCommand {
  constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private postsRepository: PostsRepository,
    private usersExternalRepository: UsersExternalRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute({ dto }: CreateCommentCommand): Promise<string> {
    await this.postsRepository.getPostByIdOrFail(dto.postId);

    const targetUser = await this.usersExternalRepository.getUserByIdOrFail(
      dto.userId,
    );

    const newComment = this.CommentModel.createInstance({
      content: dto.content,
      userId: dto.userId,
      postId: dto.postId,
      userLogin: targetUser.accountData.login,
    });

    return this.commentsRepository.save(newComment);
  }
}
