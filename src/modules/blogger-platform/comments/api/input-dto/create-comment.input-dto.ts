import { IsStringWithTrim } from '../../../../../core/decorators/validation/string-with-trim';
import { commentContentLength } from '../../domain/comment.entity';

export class CreateCommentInputDto {
  @IsStringWithTrim(commentContentLength.max, commentContentLength.min)
  content: string;
}
