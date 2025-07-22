import { UserModelType } from '../users-accounts/domain/user.entity';
import { BlogModelType } from '../blogger-platform/blogs/domain/blog.entity';
import { PostModelType } from '../blogger-platform/posts/domain/post.entity';
export declare class TestingAllDataController {
    private UserModel;
    private BlogModel;
    private PostModel;
    constructor(UserModel: UserModelType, BlogModel: BlogModelType, PostModel: PostModelType);
    removeAllData(): Promise<void>;
}
