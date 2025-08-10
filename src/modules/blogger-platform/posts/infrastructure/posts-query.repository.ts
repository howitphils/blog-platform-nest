import { PostLikeModelType } from './../domain/post-like.entity';
import { Post, PostModelType } from './../domain/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsQueryParams } from '../api/input-dto/posts.query-params';
import { PostViewDto } from '../api/view-dto/post.view-dto';
import { PaginatedViewModel } from '../../../../core/dto/pagination-view.base';
import { Blog, BlogModelType } from '../../blogs/domain/blog.entity';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { PostLike } from '../domain/post-like.entity';
import { LikeStatusObj } from '../../../../core/dto/like-status-object';
import { LikeStatuses } from '../../../../core/enums/like-statuses';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(PostLike.name) private PostLikeModel: PostLikeModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  async getPostByIdOrFail(
    postId: string,
    userId?: string | null,
  ): Promise<PostViewDto> {
    const post = await this.PostModel.findById(postId);

    if (!post) {
      throw new DomainException(
        'Post not found',
        DomainExceptionCodes.NotFound,
      );
    }

    let postLikeStatus = LikeStatuses.None;

    // Получаем лайк для поста конкретного юзера
    if (userId) {
      const postLike = await this.PostLikeModel.findOne({
        postId: post.id,
        userId,
      });

      if (postLike) {
        postLikeStatus = postLike.status;
      }
    }

    return PostViewDto.mapToView(post, postLikeStatus);
  }

  async getPosts(
    queryParams: PostsQueryParams,
    userId: string | null,
    blogId: string | null,
  ): Promise<PaginatedViewModel<PostViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

    let filter = {};

    if (blogId) {
      const blog = await this.BlogModel.findById(blogId);

      if (!blog) {
        throw new DomainException(
          'Blog not found',
          DomainExceptionCodes.NotFound,
        );
      }

      filter = { blogId };
    }

    const posts = await this.PostModel.find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(queryParams.calculateSkip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.PostModel.countDocuments(filter);

    let likesObj: LikeStatusObj = {};

    if (userId) {
      const postsIds = posts.map((post) => post._id.toString());

      // Получаем лайки юзера для найденных постов
      const likes = await this.PostLikeModel.find({
        postId: { $in: postsIds },
        userId,
      }).lean();

      // Преобразуем в объект формата postId: likeStatus для более быстрого считывания
      likesObj = likes.reduce((acc: LikeStatusObj, like) => {
        acc[like.postId] = like.status;
        return acc;
      }, {});
    }

    return PaginatedViewModel.mapToView({
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map((post) => {
        const likeStatus = likesObj[post._id.toString()] || LikeStatuses.None;

        return PostViewDto.mapToView(post, likeStatus);
      }),
    });
  }
}
