import { CreateUserDto } from '../../dto/create-user.dto';

// Нужен будет для описаний параметров domain и application слоев (будет расширен методами)
export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}
