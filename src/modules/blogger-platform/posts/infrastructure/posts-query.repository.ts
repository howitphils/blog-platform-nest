import { PostLikeModelType } from './../domain/post-like.entity';
import { Post, PostModelType } from './../domain/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostViewDto } from '../api/view-dto/post.view-dto';
import { PaginatedViewModel } from '../../../../core/dto/pagination-view.base';
import { Blog, BlogModelType } from '../../blogs/domain/blog.entity';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { PostLike } from '../domain/post-like.entity';
import { LikeStatusObj } from '../../../../core/dto/like-status-object';
import { LikeStatuses } from '../../../../core/enums/like-statuses';
import { GetPostsDto } from './dto/get-posts.dto';
import { GetPostDto } from './dto/get-post.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(PostLike.name) private PostLikeModel: PostLikeModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  async getPostByIdOrFail(dto: GetPostDto): Promise<PostViewDto> {
    const post = await this.PostModel.findById(dto.postId);

    if (!post) {
      throw new DomainException(
        'Post not found',
        DomainExceptionCodes.NotFound,
      );
    }

    let postLikeStatus = LikeStatuses.None;

    // Получаем лайк для поста конкретного юзера
    if (dto.user) {
      const postLike = await this.PostLikeModel.findOne({
        postId: post.id,
        userId: dto.user.id,
      });

      if (postLike) {
        postLikeStatus = postLike.status;
      }
    }

    return PostViewDto.mapToView(post, postLikeStatus);
  }

  async getPosts(dto: GetPostsDto): Promise<PaginatedViewModel<PostViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = dto.queryParams;

    let filter = {};

    if (dto.blogId) {
      const blog = await this.BlogModel.findById(dto.blogId);

      if (!blog) {
        throw new DomainException(
          'Blog not found',
          DomainExceptionCodes.NotFound,
        );
      }

      filter = { blogId: dto.blogId };
    }

    const posts = await this.PostModel.find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(dto.queryParams.calculateSkip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.PostModel.countDocuments(filter);

    let likesObj: LikeStatusObj = {};

    if (dto.user) {
      const postsIds = posts.map((post) => post._id.toString());

      // Получаем лайки юзера для найденных постов
      const likes = await this.PostLikeModel.find({
        postId: { $in: postsIds },
        userId: dto.user.id,
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
