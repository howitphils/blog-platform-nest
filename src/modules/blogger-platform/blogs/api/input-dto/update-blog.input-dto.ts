import { Matches } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators/validation/string-with-trim';

const blogNameMaxLength = 15;

const blogDescriptionMaxLength = 500;

const websiteUrlMaxLength = 100;

export class UpdateBlogInputDto {
  @IsStringWithTrim(blogNameMaxLength)
  name: string;

  @IsStringWithTrim(blogDescriptionMaxLength)
  description: string;

  @IsStringWithTrim(websiteUrlMaxLength)
  @Matches(
    '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
    '',
    {
      message: 'Must be an email',
    },
  )
  websiteUrl: string;
}
