import { IsMongoId, IsString } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators/validation/string-with-trim';

const titleMaxLength = 30;

const shortDescriptionMaxLength = 100;

const contentMaxLength = 1000;

export class CreatePostInputDto {
  @IsStringWithTrim(titleMaxLength)
  title: string;

  @IsStringWithTrim(shortDescriptionMaxLength)
  shortDescription: string;

  @IsStringWithTrim(contentMaxLength)
  content: string;

  @IsString()
  @IsMongoId()
  blogId: string;
}
