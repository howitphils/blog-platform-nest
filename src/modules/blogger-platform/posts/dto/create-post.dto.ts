export class CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class CreatePostDtoTest {
  title?: string;
  shortDescription?: string;
  content?: string;
  blogId: string;
}
